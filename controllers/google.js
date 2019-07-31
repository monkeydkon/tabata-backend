const {google} = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

const scopes = [
    'https://www.googleapis.com/auth/blogger',
    'https://www.googleapis.com/auth/calendar'
];

const url = oauth2Client.generateAuthUrl({
    scopes: scopes
});


exports.getGoogleAccountFromCode = async (code) => {
    res.status(200).json({code:code});
    // const { tokens } = await oauth2Client.getTokens(code);
    // oauth2Client.setCredentias(tokens);
};
// const googleCongif = {
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     redirect: '/auth/google/redirect ',
// };

// const defaultScope = [
//     'https://www.googleapis.com/auth/plus.me',
//     'https://www.googleapis.com/auth/userinfo.email',
// ];

// const createConnection = () => {
//     return new google.auth.OAuth2(
//         googleCongif.clientId,
//         googleConfig.clientSecret,
//         googleConfig.redirect
//     );
// };

// const getConnectionUrl = (auth) => {
//     return auth.generateAuthUrl({
//         access_type: 'offline',
//         prompt: 'consent',
//         scope: defaultScope
//     });
// };

// const getGooglePlusApi = (auth) => {
//     return google.plus({ version: 'v1', auth });
// };

// const urlGoogle = () => {
//     const auth = createConnection();
//     const url = getConnectionUrl(auth);
//     return url;
// };

// exports.getGoogleAccountFromCode = async(code) => {
//     const data = await auth.getToken(code);
//     const tokens = data.tokens;
//     const auth = createConnection();
//     auth.setCredentials(tokens);
//     const plus = getGooglePlusApi(auth);
//     const me = await plus.people.get({ userId: 'me' });
//     const userGoogleId = me.data.id;
//     const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
//     return {
//         id: userGoogleId,
//         email: userGoogleEmail,
//         tokens: tokens,
//     };
