import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import Workout from "../models/workout.model.js";



export const updateUser =  async (req, res, next) => {
  const userId = req.user.id || req.user._id;
  if(userId !== req.params.id) return next(errorHandler(401, "You can only update your account"));
  try {
      if(req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        }
      }, {new: true});

      const {password, ...rest} = updatedUser._doc;

      res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
}

export const getUserWorkouts = async (req,res,next) => {
  const userId = req.user.id || req.user._id;
  if(userId === req.params.id) {
    try {
      const listings = await Workout.find({userRef: req.params.id})
      res.status(200).json(listings);
    } catch (error) {
      next(error)
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings'))
  }
}

export const deleteUser = async (req, res, next) => {
  const userId = req.user.id || req.user._id;
  if(userId !== req.params.id) return next(errorHandler(401, "You can only delete your account"));
  try {
    // Delete all workouts associated with the user first
    await Workout.deleteMany({ userRef: req.params.id });
    // Delete the user account
    await User.findByIdAndDelete(req.params.id);
    
    res.clearCookie("access_token");
    res.status(200).json({
      message: "Account and associated workouts deleted successfully"
    });
  } catch (err) {
    next(err);
  }
}