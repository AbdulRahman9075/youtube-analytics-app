import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export function generateToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
