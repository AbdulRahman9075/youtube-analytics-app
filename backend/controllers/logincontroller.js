import https from 'https';
import url from 'url';
import { google } from 'googleapis';
import crypto from 'crypto';
import fs from 'fs';
import {home} from './homecontroller.js'
import oauth2Client from '../helpers/oauth.js';
const secret = JSON.parse(fs.readFileSync('./clientsecrets.json', 'utf8'));
/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.
 * To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
// const YOUR_CLIENT_ID = secret.web.client_id;
// const YOUR_CLIENT_SECRET = secret.web.client_secret;
// const YOUR_REDIRECT_URL = secret.web.redirect_uris[0];

// const oauth2Client = new google.auth.OAuth2(
//   YOUR_CLIENT_ID,
//   YOUR_CLIENT_SECRET,
//   YOUR_REDIRECT_URL
// );

// Access scopes for two non-Sign-In scopes: Read-only Drive activity and Google Calendar.
const scopes = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.force-ssl'
];

/* Global variable that stores user credential in this code example.
 * ACTION ITEM for developers:
 *   Store user's refresh token in your data store if
 *   incorporating this code into your real app.
 *   For more information on handling refresh tokens,
 *   see https://github.com/googleapis/google-api-nodejs-client#handling-refresh-tokens
 */
let userCredential = null;
const redirectToOAuth = async(req,res) => {
    // Generate a secure random state value.
    const state = crypto.randomBytes(32).toString('hex');
    // Store state in the session
    req.session.state = state;
    
    // Generate a url that asks permissions for the Drive activity and Google Calendar scope
    const authorizationUrl = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        /** Pass in the scopes array defined above.
        * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
        scope: scopes,
        // Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes: true,
        // Include the state parameter to reduce the risk of CSRF attacks.
        state: state
    });
    
    res.redirect(authorizationUrl);
}

const recieveOAuthCallback = async (req, res) => {
  // Handle the OAuth 2.0 server response
  const q = url.parse(req.url, true).query;

  if (q.error) {
    console.log('Error:' + q.error);
    return res.send('OAuth error: ' + q.error);
  }

  if (q.state !== req.session.state) {
    console.log('State mismatch. Possible CSRF attack');
    return res.end('State mismatch. Possible CSRF attack');
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(q.code);
    oauth2Client.setCredentials(tokens);

    // ✅ Save tokens to session
    req.session.tokens = tokens;

    // (Optional) Save globally if still needed
    userCredential = tokens;
    
    //use youtube api
    res.redirect('/home');
  
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('Failed to handle OAuth callback');
  }
};

const revokeTokenandLogout = async (req, res) => {
  const accessToken = req.session.tokens?.access_token;

  if (!accessToken) {
    return res.status(400).send('No access token available. Please log in first.');
  }

  const postData = `token=${accessToken}`;

  const postOptions = {
    host: 'oauth2.googleapis.com',
    port: 443,
    path: '/revoke',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const revokeReq = https.request(postOptions, (googleRes) => {
    googleRes.setEncoding('utf8');

    googleRes.on('data', (chunk) => {
      console.log('Revoke response:', chunk);
    });

    googleRes.on('end', () => {
      req.session.destroy(() => {
        res.send('Access token revoked and session ended. You have been logged out.');
      });
    });
  });

  revokeReq.on('error', (error) => {
    console.error('Revoke request error:', error);
    res.status(500).send('Error revoking access token');
  });

  revokeReq.write(postData);
  revokeReq.end();

  // add logout and frontend logic here
};

export default {
    redirectToOAuth,
    recieveOAuthCallback,
    revokeTokenandLogout
}