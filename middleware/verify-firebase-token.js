const admin = require('firebase-admin');

exports.verify = (req, res, next) => {
  //  const token = req.body.token;

    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    // idToken comes from the client app
    let actualtoken;
    admin.auth().verifyIdToken(token)
        .then(decodedToken => {
            if (!decodedToken) {
                const error = new Error('Not authenticated')
                error.statusCode = 401;
                throw error;
            }
            actualtoken = decodedToken;
            req.userId = actualtoken.uid;
            console.log(actualtoken, 'token');
            console.log(req.userId, "a0x0aa0axa0xx0xa0");
            next();
        }).catch(err => {
            err.statusCode = 500;
            throw err;
        });


};