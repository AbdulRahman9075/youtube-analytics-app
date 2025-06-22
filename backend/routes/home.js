import express from 'express';
import { home } from '../controllers/homecontroller.js';
//import { home } from '../test.js';
const router = express.Router();

// Route 1
router.get('/',home);

export default router;
