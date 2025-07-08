import express from 'express';
import { sendCurrentSubscriptions } from '../controllers/homecontroller.js';
import { authenticate } from '../middlewares/auth.js';
const router = express.Router();

// Route 1
router.get('/',authenticate,sendCurrentSubscriptions);

export default router;
