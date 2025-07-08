import jwt from 'jsonwebtoken';
import {jwtCode} from '../private/secretcode.js';

const JWT_SECRET = jwtCode();

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
