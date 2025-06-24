// scheduler.js
import cron from 'node-cron';
import { fetchAndProcessSubscriptions } from './controllers/homecontroller.js';
import { loadTokens } from './helpers/utilities.js';
import logger from './helpers/errorHandler.js'

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

export const startScheduler = () => {
  // [TEST] set to : every 1 minute(s)
  cron.schedule('*/1 * * * *', async () => {
    //console.log("SUCCESS: [node-cron] Running scheduled YouTube data fetch...");
    logger.info("SUCCESS: [node-cron] Running scheduled YouTube data fetch...");

    try {
      const tokens = await loadTokens();
      await fetchAndProcessSubscriptions(tokens); // your main processing function
      logger.info("SUCCESS: [node-cron] Fetch and analysis complete.\n\n");
      //console.log("SUCCESS: [node-cron] Fetch and analysis complete.\n\n");
    } catch (error) {
      logger.error("FAILED:  [node-cron] Error during scheduled task:", error);
      //console.error("FAILED:  [node-cron] Error during scheduled task:", error);
    }
  });
  logger.info("SUCCESS: [node-cron] Scheduler started: CHECK DURATION IN scheduler.js");
  //console.log("SUCCESS: [node-cron] Scheduler started: CHECK DURATION IN scheduler.js");
};
