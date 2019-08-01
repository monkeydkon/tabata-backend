//import { google } from 'googleapis';
const {google} = require('googleapis');

exports.getGoogleAccountFromCode = (req, res, next) => {
    const code = req.body.code;
    const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage');
    google.options({ auth: oauth2Client });


    oauth2Client.getToken(code).then(res => {
        const tokens = res.tokens;
        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({ version: 'v2' });
        return oauth2.userinfo.get();
    })
        .then(userData => {
            console.log(userData.config.data);
        })
        .catch(err => {
            console.log(err);
        });
};