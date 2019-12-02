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
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch(err){
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('Not authenticated')
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.data.userId;
    console.log(decodedToken,'token');
    console.log(req.userId,"a0x0aa0axa0xx0xa0");
    next();
};