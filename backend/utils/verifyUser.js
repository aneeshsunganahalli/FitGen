import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  
  if (!token) {
    return next( errorHandler(401, 'You are not authenticated!'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(errorHandler(401, 'Token is not valid!'));
  }
};