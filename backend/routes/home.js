import express from 'express';
import { home } from '../controllers/homecontroller.js';
import { authenticate } from '../middlewares/auth.js';
const router = express.Router();

// Route 1
router.get('/',authenticate,home);

export default router;
