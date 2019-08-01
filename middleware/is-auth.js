const jwt = require('jsonwebtoken');

exports.checkAuthentication = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, 'secret');
    } catch(err){
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('Not authenticated')
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};

//check if Token exists on request Header and attach token to request as attribute
// exports.checkTokenMW = (req, res, next) => {
//     // Get auth header value
//     const bearerHeader = req.get('Authorization');
//     if (typeof bearerHeader !== 'undefined') {
//         req.token = bearerHeader.split(' ')[1];
//         next();
//     } else {
//         res.sendStatus(403);
//     }
// };

//Verify Token validity and attach token data as request attribute
// exports.verifyToken = (req, res) => {
//     jwt.verify(req.token, 'secret', (err, authData) => {
//         if(err) {
//             res.sendStatus(403);
//         } else {
//             return req.authData = authData;
//         }
//     })
// };

//Issue Token
// exports.signToken = (req, res) => {
//     jwt.sign({userId: req.user._id}, 'secret', {expiresIn:'5 min'}, (err, token) => {
//         if(err){
//             res.sendStatus(500);
//         } else {
//             console.log(token);
//             res.status(200).json({token: token, message: "take your token bro"});
//         }
//     });
// };