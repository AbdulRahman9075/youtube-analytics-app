import express from 'express';
import { sendCurrentSubscriptions } from '../controllers/homecontroller.js';
const router = express.Router();

// Route 1
router.get('/',sendCurrentSubscriptions);

export default router;
