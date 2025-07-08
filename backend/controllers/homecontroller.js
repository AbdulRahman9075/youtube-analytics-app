import { google } from 'googleapis';
import oauth2Client from '../helpers/oauth.js';

import Channel from '../helpers/channel.js';
import {processNewChannels} from '../helpers/analyse.js';
import Subscriptions from '../models/datamodel.js';
import Analytics from '../models/analyticsmodel.js';
import User from '../models/usermodel.js';
import logger , {sendError} from "../helpers/errorHandler.js";

let CHANNELS = {};
let ALL_ENTRIES = {};

// /home route function
export const home = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if(!user) return sendError(res,404, "User not found", "USER_NOT_FOUND");


    await fetchAndProcessSubscriptions(userId,user);
    logger.info("SUCCESS: EXECUTION COMPLETE REDIRECTED TO HOME");
    res.status(200).json(ALL_ENTRIES[userId]);


  } catch (error) {
    sendError(res,500,"FAILED: Error in /home","INTERNAL_ROUTE_ERROR");
    
  }
};

const setChannels = (userId,channels) => {
  CHANNELS[userId] = channels;
  logger.info(`Fetched Current Channels for ${userId} `);
}

// /subscription route function
export const sendCurrentSubscriptions = async (req,res) => {
  try {
    const userId = req.user.userId;
    res.status(200).json(CHANNELS[userId]);
    logger.info("SUCCESS: Subscription response sent");
  
  } catch (error) {
    sendError(res,500,"FAILED: Error in /subscriptions","INTERNAL_ROUTE_ERROR");
    
  }
}

const getAllEntries = async (userId) => {
  try {
    ALL_ENTRIES[userId] = await Analytics.find({userId}).sort({ date: 1 }).exec(); // 1 = ascending
    logger.info(`Fetched all Analytics Entries for ${userId} `);
  } catch (error) {
    logger.error(`FAILED: Error fetching entries`, error);
    throw error;
  }
};


const fetchAndProcessSubscriptions = async (userId,user) => {
  
    const { accessToken, refreshToken } = user;
    const oauth = oauth2Client;
    oauth.setCredentials({ access_token: accessToken, refresh_token: refreshToken });


    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    //Get all subscriptions (paginated)
    const allSubscriptions = [];
    const publishedAtMap = {}; // channelId → publishedAt
    let nextPageToken = null;

    try{
      do {
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
      } while (nextPageToken);
    }catch(error){
        logger.error(`YouTube API unreachable for ${user.email}: `, error.message);
        sendError(res,503,"Cannot reach YouTube API","YOUTUBE_UNAVAILABLE");
        return;
      }

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

    //Check 

    if (allChannelDetails.length !== allSubscriptions.length) {
      logger.warn(
        `Mismatch: Expected ${allSubscriptions.length}, got ${allChannelDetails.length}`
      );
      return; 
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
      }
    }

    // Order by subscription  date
    const previousDoc = await Subscriptions.findOne({userId}); // no filter needed
    const previousChannels = previousDoc?.channels || [];

    await processNewChannels(userId,channelObjects,previousChannels);
    channelObjects.sort((a, b) => a.subscribeAt - b.subscribeAt);

    await Subscriptions.findOneAndUpdate(
      { userId },
      { $set: { channels: channelObjects } },
      { upsert: true, new: true }
    );
    // // GET LAST DATABASE ENTRY
    getAllEntries(userId);
    // //MAKE CHANNELS GLOBALLY AVAILABLE
    setChannels(userId,channelObjects);
};

export {fetchAndProcessSubscriptions};