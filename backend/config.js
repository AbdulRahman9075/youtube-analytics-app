import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const SCHEDULER_SECRET = process.env.SCHEDULER_SECRET;
export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT;
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const REDIRECT_URIS = process.env.REDIRECT_URIS;

