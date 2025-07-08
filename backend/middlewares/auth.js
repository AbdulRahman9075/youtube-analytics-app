import jwt from 'jsonwebtoken';
import { sendError } from '../helpers/errorHandler.js';
import { JWT_SECRET } from '../config.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) return sendError(res,401,"FAILED: No Tokens","TOKEN_NOT_FOUND");

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token,JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    sendError(res,401,"FAILED: Invalid Token","INVALID_TOKEN");
  }
};
