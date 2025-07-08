// IMPORTANT!!:  UPDATE REDIRECT LINKS BEFORE DEPLOYMENT [IN OAUTHCALLBACK AND LOGOUT]

import url from 'url';
import crypto from 'crypto';
import axios from "axios";
import User from '../models/usermodel.js';
import oauth2Client from '../helpers/oauth.js';
import {generateToken} from '../helpers/jwt.js';
import logger,{sendError} from '../helpers/errorHandler.js'
/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.
 * To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
// Access scopes
const scopes = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  
];

const redirectToOAuth = async(req,res) => {  
    // Generate a secure random state value.
    const state = crypto.randomBytes(32).toString('hex');
    
    // Generate a url that asks permissions
    const authorizationUrl = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        /** Pass in the scopes array defined above.
        * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
        scope: scopes,
        // Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes: true,
        // Include the state parameter to reduce the risk of CSRF attacks.[CSRF CHECK HAS NOT BEEN IMPLEMENTED]
        state: state
    });
    res.redirect(authorizationUrl);
}

const recieveOAuthCallback = async (req, res) => {  // /api/oauth2callback
  // Handle the OAuth 2.0 server response
  const q = url.parse(req.url, true).query;

  if (q.error) {
    return sendError(res,401,'OAuth error: ' + q.error,"OAUTH_FALIURE");
  }

  //REQ.SESSION LOGIC IS NO LONGER USABLE SO THIS IS REDUNDANT
  // if (q.state !== req.session.state) {
  //   return sendError(res,403,'State mismatch. Possible CSRF attack',"STATE_MISMATCH_OR_CRSF");
  // }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(q.code);
    oauth2Client.setCredentials(tokens);

    //REQ.SESSION LOGIC IS NO LONGER USABLE SO THIS IS REDUNDANT
    // Save tokens to session and Save globally if still needed
    // req.session.tokens = tokens;
    // userCredential = tokens;

    const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    const { id, email, name, picture } = userInfoRes.data;

    //tokens.expires_in? new Date(Date.now() + tokens.expires_in * 1000): [REDUNDANT]
    const tokenexpiry = tokens.expiry_date? new Date(tokens.expiry_date): new Date(Date.now() + 3600 * 1000); // fallback
    // Save or update user in MongoDB
    let user = await User.findOneAndUpdate(
      { googleId: id },
      {
        googleId: id,
        email,
        name,
        profilePhoto: picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: tokenexpiry
      },
      { new: true, upsert: true }
    );

    // Generate JWT for frontend to store
    const jwtToken = generateToken(user);

    //res.redirect(`http://localhost:3000/home?token=${jwtToken}`); //redirect to FRONTEND
    res.redirect(`/home?token=${jwtToken}`); //url after build
  } catch (err) {
    sendError(res,500,'Failed to handle OAuth callback','LOGIN_FALIURE')
  }
};

const revokeTokenandLogout = async (req, res) => { 
  try{
    
    const userId = req.user?.userId;
    
    if (!userId) return sendError(res, 401, "Unauthorized", "NO_USER_ID");

    const user = await User.findById(userId);
    if (!user || !user.accessToken) {
      return sendError(res, 400, "No access token found", "NO_ACCESS_TOKEN");
    }
    
    const response = await axios.post(
        `https://oauth2.googleapis.com/revoke?token=${user.accessToken}`,
        {},
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    user.accessToken = null;
    user.refreshToken = null;
    user.tokenExpiry = null;
    await user.save();

    logger.info(`SUCCESS: Access token revoked and tokens cleared for ${userId}`);

    //res.redirect('http://localhost:3000/'); // Redirect to frontend logout page
    res.redirect('/');  //url after build
  }
  catch(err){
    sendError(res,500,"FAILED: TO LOGOUT","LOGOUT_FALIURE");
  }
};

export default {
    redirectToOAuth,
    recieveOAuthCallback,
    revokeTokenandLogout
}