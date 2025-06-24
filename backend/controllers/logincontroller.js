// remove old res.status comments if no error

import https from 'https';
import url from 'url';
import crypto from 'crypto';
import fs from 'fs';
import oauth2Client from '../helpers/oauth.js';
import logger,{sendError} from '../helpers/errorHandler.js'
const secret = JSON.parse(fs.readFileSync('../backend/private/clientsecrets.json', 'utf8'));
/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.
 * To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
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
    //console.log('ERROR:' + q.error);
    //return res.send('OAuth error: ' + q.error);
    return sendError(res,401,'OAuth error: ' + q.error,"OAUTH_FALIURE");
  }

  if (q.state !== req.session.state) {
    //console.log('ERROR: State mismatch. Possible CSRF attack');
    //return res.end('State mismatch. Possible CSRF attack');
    return sendError(res,403,'State mismatch. Possible CSRF attack',"STATE_MISMATCH_OR_CRSF");
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(q.code);
    oauth2Client.setCredentials(tokens);

    // Save tokens to session
    req.session.tokens = tokens;

    //Save globally if still needed
    userCredential = tokens;
    
    
    res.redirect('/home');  //redirect to youtube api fetch call
  
  } catch (err) {
    //console.error('ERROR: OAuth callback error:', err);

    //res.status(500).send('Failed to handle OAuth callback');
    sendError(res,500,'Failed to handle OAuth callback','LOGIN_FALIURE')
  }
};

const revokeTokenandLogout = async (req, res) => {
  const accessToken = req.session.tokens?.access_token;

  if (!accessToken) {
    return sendError(res,401,"No access token available. Please log in first.","NO_TOKENS")
    //return res.status(400).send('No access token available. Please log in first.');
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
    //console.error('Revoke request error:', error);
    sendError(res,502,"Error revoking access token","REVOKE_FAILED");
    //res.status(500).send('Error revoking access token');
  });

  revokeReq.write(postData);
  revokeReq.end();
};

export default {
    redirectToOAuth,
    recieveOAuthCallback,
    revokeTokenandLogout
}