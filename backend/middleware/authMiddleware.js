import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 1. Protect routes: User must be logged in
export const protect = async (req, res, next) => {
  let token;

  // Check if header has "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the ID in the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next function
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 2. Admin Check: User must be an Admin
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};