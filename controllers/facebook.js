// const {FB, FacebookApiException} = require('fb');
// const fb = new Facebook(options);
const axios = require('axios');
const { validationResult } = require('express-validator/check');


exports.getFacebookAccountFromCode = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const code = req.body.code;
    axios.get(`https://graph.facebook.com/v4.0/oauth/access_token?
        client_id={${process.env.FACEBOOK_CLIENT_ID}}
        &redirect_uri={localhost:3000}
        &client_secret={${process.env.FACEBOOK_CLIENT_SECRET}}
        &code={${code}}`)
        .then(result => {
            console.log(result.data);
            res.json({ data: result.data })
        })
        .catch(err => {
            console.log(err);
        });
};