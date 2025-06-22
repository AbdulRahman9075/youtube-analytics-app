import { google } from 'googleapis';
import fs from "fs";

const secret = JSON.parse(fs.readFileSync('./clientsecrets.json', 'utf8'));

const oauth2Client = new google.auth.OAuth2(
  secret.web.client_id,
  secret.web.client_secret,
  secret.web.redirect_uris[0]
);

export default oauth2Client;