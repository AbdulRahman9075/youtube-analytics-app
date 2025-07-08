// Scheduler Expression Guide 
// Description	                        Cron Expression	Notes
// Every minute	      * * * * *	        Too frequent for most analytics tasks
// Every 5 minutes	  */5 * * * *	      Good for polling APIs
// Every 15 minutes	  */15 * * * *	    Common for small-scale syncs
// Every hour	        0 * * * *	        At the top of every hour
// Every 6 hours	    0 */6 * * *	      Good for medium-frequency tasks
// Every 12 hours	    0 */12 * * *	    Ideal for light analytics fetch
// daily at 00:00	    0 0 * * *	        Clean daily run at 00:00
// daily at 6 AM	    0 6 * * *	        Adjust for time zone or user activity
// Twice daily (6 AM and 6 PM)	    0 6,18 * * *	    Good balance for global user base
// Every Monday at 8 AM (weekly)	  0 8 * * 1	        Weekly report on Monday morning
// First of every month at 1 AM	    0 1 1 * *	        Monthly summary tasks

// IMPORTANT: CHANGE SCHEDULER TIME BEFORE DEPLOYMENT
import express from 'express';
import User from '../models/usermodel.js';
import { fetchAndProcessSubscriptions } from '../controllers/homecontroller.js';
import logger from '../helpers/errorHandler.js';
import { oauth2Client } from '../helpers/oauth.js';
import { schedulerCode } from '../private/secretcode.js';
import { sendError } from '../helpers/errorHandler.js';

const router = express.Router();

router.get('/run-scheduler', async (req, res) => {
  const SECRET = schedulerCode();
  console.log(`SECRET=${SECRET}`);
  console.log(`RECIEVED=${req.query.key}`);
   if (req.query.key !== SECRET) {
    console.log(`SECRET=${SECRET}`);
    console.log(`RECIEVED=${req.query.key}`);
    return sendError(res,403,"Unauthorised","INVALID_TOKENS");
    
  }
  
  logger.info('SUCCESS: [cron-job.org] Scheduler route hit');

  try {
    const users = await User.find({ accessToken: { $ne: null }, refreshToken: { $ne: null } });

    if (users.length === 0) {
      logger.warn('WARN: [node-cron] No users with valid tokens found. Skipping task.');
      return res.send('No valid users.');
    }

    for (const user of users) {
      try {
        const now = new Date();

        // Refresh token if access token is expired or missing expiry
        if (!user.tokenExpiry || user.tokenExpiry < now) {
          logger.info(`INFO: Token expired for ${user.email}, attempting refresh...`);

          oauth2Client.setCredentials({ refresh_token: user.refreshToken });

          const { credentials } = await oauth2Client.refreshAccessToken(); // deprecated but works
          user.accessToken = credentials.access_token;
          user.tokenExpiry = credentials.expiry_date ? new Date(credentials.expiry_date) : null;

          await user.save();
          logger.info(`SUCCESS: Refreshed token for ${user.email}`);
        }

        // Set OAuth2 client credentials for API call
        oauth2Client.setCredentials({
          access_token: user.accessToken,
          refresh_token: user.refreshToken,
        });

        await fetchAndProcessSubscriptions(user._id, user);
        logger.info(`SUCCESS: Data processed for ${user.email}`);
      } catch (userErr) {
        logger.error(`FAILED: Error processing ${user.email}`, userErr.message);
        
      }
    }

    logger.info('SUCCESS: All users processed.\n');
    return res.send('Scheduler task completed.');
  } catch (err) {
    logger.error('FAILED: Error in scheduler route', err.message);
    return sendError(res,500,'Error running scheduler task',"SCHEDULER_ERROR");
    
  }

});

export default router;
