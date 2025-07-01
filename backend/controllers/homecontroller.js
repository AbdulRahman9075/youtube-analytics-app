import { google } from 'googleapis';
import oauth2Client from '../helpers/oauth.js';

import Channel from '../helpers/channel.js';

import {saveTokens} from '../helpers/utilities.js'

import {processNewChannels} from '../helpers/analyse.js';
import Subscriptions from '../models/datamodel.js';
import Analytics from '../models/analyticsmodel.js';

import logger , {sendError} from "../helpers/errorHandler.js";

let CHANNELS = null;
let LAST_ANALTICS_ENTRY = null;

export const home = async (req, res) => {
  try {
    const tokens = req.session.tokens;
    await saveTokens(tokens); // persist for later use
    await fetchAndProcessSubscriptions(tokens);
    logger.info("SUCCESS: EXECUTION COMPLETE REDIRECTED TO HOME");
    
    // make global variables of any current/prev channel info
    // needed and send as response

    res.status(200).json(LAST_ANALTICS_ENTRY); // Non graphical [last entry of analytics]

  } catch (error) {
    //console.error("FAILED: Error in /home route:", error);
    sendError(res,500,"FAILED: Error in /home","INTERNAL_ROUTE_ERROR")
    //res.status(500).json({ error: "FAILED: Server error" });
    
  }
};

const setChannels = (channels) => {
  CHANNELS = channels;
}

export const sendCurrentSubscriptions = async (req,res) => {
  try {

    res.status(200)
       .set('Content-Type', 'application/json')
       .send(JSON.stringify(CHANNELS,null,1)); 
    logger.info("SUCCESS: Subscription response sent");

  } catch (error) {
    //console.error("FAILED: Error in /home route:", error);
    sendError(res,500,"FAILED: Error in /subscriptions","INTERNAL_ROUTE_ERROR")
    //res.status(500).json({ error: "FAILED: Server error" });
    
  }
}

const getLastEntry = async (Model) => {
  try {
    LAST_ANALTICS_ENTRY = await Model.findOne().sort({ date: -1 }).exec();

    //console.log(LAST_ANALTICS_ENTRY);
    
  } catch (error) {
    //console.error("Error fetching last entry:", error);
    logger.error(`FAILED: Error fetching last entry`,error);
    throw error;
  }
};


const fetchAndProcessSubscriptions = async (tokens) => {
  
    const oauth = oauth2Client;
    oauth.setCredentials(tokens);

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    //Get all subscriptions (paginated)
    const allSubscriptions = [];
    const publishedAtMap = {}; // channelId → publishedAt
    let nextPageToken = null;

    do {
      try{
        const subRes = await youtube.subscriptions.list({
          part: 'snippet',
          mine: true,
          maxResults: 50,
          pageToken: nextPageToken,
        });
      
      
        subRes.data.items.forEach(sub => {
          const channelId = sub.snippet.resourceId.channelId;
          allSubscriptions.push(channelId);
          publishedAtMap[channelId] = sub.snippet.publishedAt;
        });

        nextPageToken = subRes.data.nextPageToken;
      }catch(error){
        logger.error("YouTube API unreachable:", error.message);
        //sendError(res,503,"Cannot reach YouTube API","YOUTUBE_UNAVAILABLE");
        return;
      }
    } while (nextPageToken);

    // Get channel details in batches of 50
    const allChannelDetails = [];

    for (let i = 0; i < allSubscriptions.length; i += 50) {
      const batchIds = allSubscriptions.slice(i, i + 50);
      const channelRes = await youtube.channels.list({
        part: 'snippet,statistics,brandingSettings,topicDetails',
        id: batchIds.join(','),
        maxResults: 50
      });
      allChannelDetails.push(...channelRes.data.items);
    }

    //Create Channel objects (with subscribedAt)
    const channelObjects = allChannelDetails.map(item => {
      const subscribedAt = publishedAtMap[item.id] || null;
      return new Channel(item, 'Uncategorized', subscribedAt);
    });

    //Error Checking
    for (const ch of channelObjects) {
      if (!(ch.subscribeAt instanceof Date)) {
        logger.warn(`❌ Bad subscribeAt:, ${ch.title}, ${ch.subscribeAt}`)
        //console.warn("❌ Bad subscribeAt:", ch.title, ch.subscribeAt);
      }
    }
    //
    
    // Order by subscription  date
    const previousDoc = await Subscriptions.findOne(); // no filter needed
    const previousChannels = previousDoc?.channels || [];

    // [TEST] clear database
    //await Analytics.deleteMany({});
    
    await processNewChannels(channelObjects,previousChannels);
    channelObjects.sort((a, b) => a.subscribeAt - b.subscribeAt);

    // GET LAST DATABASE ENTRY
    getLastEntry(Analytics);
    //MAKE CHANNELS GLOBALLY AVAILABLE
    setChannels(channelObjects);


    
    //Store to DB

    await Subscriptions.findOneAndUpdate(
      {}, // no filter, or add filter if per user
      {
        channels: channelObjects
      },
      { upsert: true, new: true }
    );
};

export {fetchAndProcessSubscriptions};