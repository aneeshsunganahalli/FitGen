import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  
  console.log('Cookies received:', req.cookies); // Debug cookies
  console.log('Access token:', token); // Debug token

  if(!token) return next(errorHandler(401, "No token found"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if(err) {
      console.log('Token verification error:', err); // Debug verification errors
      return next(errorHandler(403, "Invalid token"));
    }
    req.user = user;
    next();
  });
};