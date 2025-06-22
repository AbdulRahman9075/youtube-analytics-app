import express from 'express';
import session from 'express-session';
import controller from "../controllers/logincontroller.js";
// import Workout from '../models/workoutmodel.js';
// import {createWorkout,getWorkout,getWorkouts} from "../controllers/workoutcontroller.js";
const router = express.Router();

router.use(session({
secret: 'secretcode', // Replace with a strong secret
resave: false,
saveUninitialized: false,
}));

//* Route 1  Example on redirecting user to Google's OAuth 2.0 server.
router.get('/',controller.redirectToOAuth);  //[AUTO SENT DO NOT SEND YOURSELF] 

//* Route 2 Receive the callback from Google's OAuth 2.0 server. [AUTO SENT DO NOT SEND YOURSELF] 
router.get('/oauth2callback',controller.recieveOAuthCallback);

//* Route 3 Example on revoking a token
router.get('/logout',controller.revokeTokenandLogout);

export default router;
