import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import { errorHandler } from '../utils/error.js';


export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Username, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'Registration failed',
        details: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Save user to database
    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id }, 
      process.env.JWT_SECRET
    );

    // Remove password from response
    const { password: pass, ...rest } = newUser._doc;

    // Set cookie and send response
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(201)
      .json(rest);

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Error creating user',
      details: error.message
    });
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    
    if (!validUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Wrong credentials' });
    }

    const token = jwt.sign(
      { _id: validUser._id }, 
      process.env.JWT_SECRET
    );

    // Set the cookie with proper options
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    const { password: pass, ...rest } = validUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


export const google = async (req, res, next) => {
  try {
      const user = await User.findOne({email: req.body.email});
      if (user) {
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        const {password: pass, ...rest} = user._doc;
        res
        .cookie('access_token', token, {httpOnly: true})
        .status(200)
        .json(rest);
  
      } else {
        const generatedPassword = Math.random().toString(36).substring(-8) + Math.random().toString(36).substring(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).substring(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo}); 

        await newUser.save();
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
        const {password: pass, ...rest} = newUser._doc
        res
        .cookie('access_token', token, {httpOnly: true})
        .status(200)
        .json(rest);

      }
  } catch(error) {
    next(error);
  }
}

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token')
    res.status(200).json({message: 'Signout successful'});
  } catch(error) {
    next(error);
  }
}