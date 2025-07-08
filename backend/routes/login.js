import express from 'express';
import controller from "../controllers/logincontroller.js";
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

//* Route 1  Example on redirecting user to Google's OAuth 2.0 server.
router.get('/',controller.redirectToOAuth);  //[AUTO SENT DO NOT SEND YOURSELF] 

//* Route 2 Receive the callback from Google's OAuth 2.0 server. [AUTO SENT DO NOT SEND YOURSELF] 
router.get('/oauth2callback',controller.recieveOAuthCallback);

//* Route 3 Example on revoking a token
router.get('/logout',authenticate,controller.revokeTokenandLogout);

export default router;
