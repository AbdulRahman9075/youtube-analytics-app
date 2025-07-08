import { google } from 'googleapis';
import fs from "fs";
import { CLIENT_SECRET,CLIENT_ID,REDIRECT_URIS } from '../config.js';
const secret = JSON.parse(fs.readFileSync('../backend/private/clientsecrets.json', 'utf8'));

const oauth2Client = new google.auth.OAuth2(
  // secret.web.client_id,
  // secret.web.client_secret,
  // secret.web.redirect_uris[0],
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URIS
);

export { oauth2Client };   //newline
export default oauth2Client;