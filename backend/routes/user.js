import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { getUserProfile } from '../controllers/usercontroller.js';

const router = express.Router();

// GET /api/user → return basic profile info
router.get('/', authenticate, getUserProfile);

export default router;
