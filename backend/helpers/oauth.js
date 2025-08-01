import { google } from 'googleapis';
import fs from "fs";
import { CLIENT_SECRET,CLIENT_ID,REDIRECT_URIS_DEV,REDIRECT_URIS_DEP,ISPRODUCTION } from '../config.js';
const secret = JSON.parse(fs.readFileSync('../backend/private/clientsecrets.json', 'utf8'));

let URI;

if(ISPRODUCTION === '1'){
  URI = REDIRECT_URIS_DEV;
}
else{
  URI=REDIRECT_URIS_DEP;
}
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  URI
);

export { oauth2Client };   //newline
export default oauth2Client;