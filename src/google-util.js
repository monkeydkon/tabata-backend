const { google } = require('googleapis');

const googleConfig = {
    clientId: '918021882776-fu8hr3q5ld81t1dlv1pd8en7ht8hu3t6.apps.googleusercontent.com ', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
    clientSecret: 'xLTQ1bM-fOYSHeiyvoy9ZzzG ', // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: 'https://localhost:3000' // this must match your google api settings
};

/**
 * Create the google auth object which gives us access to talk to google's apis.
 */
const createConnection = () => {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
];

const getConnectionUrl = (auth) => {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
        scope: defaultScope
    });
}

exports.urlGoogle = (req, res, next) => {
    const auth = createConnection(); // this is from previous step
    const url = getConnectionUrl(auth);
    res.status(200).json({url :url});
    console.log(url);
}
