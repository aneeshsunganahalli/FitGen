import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    console.log('Received token:', token); // Debug log
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Debug log
      
      if (!decoded || !decoded._id) {
        return res.status(401).json({ message: 'Invalid token structure' });
      }

      req.user = decoded;
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return res.status(401).json({ 
        message: 'Invalid token',
        error: jwtError.message 
      });
    }
  } catch (error) {
    console.error('Token middleware error:', error);
    return res.status(401).json({ 
      message: 'Authentication error',
      error: error.message 
    });
  }
};