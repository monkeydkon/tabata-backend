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
    const clientId = req.body.clientId;
    const redirectUri = req.body.redirectUri;
    let access_token;
    axios.get('https://graph.facebook.com/v4.0/oauth/access_token', {
        params: {
            client_id: clientId,
            redirect_uri: redirectUri,
            client_secret: process.env.FACEBOOK_CLIENT_SECRET,
            code
        }
    })
        .then(result => {
            access_token = result.data.access_token;
            return axios.get('https://graph.facebook.com/debug_token', {
                params: {
                    input_token: result.data.access_token,
                    access_token: '880265009023386|SpxU0nDVJVepFZrRBVYnoVKcnwU'
                }
            });
        })
        .then(result => {
            // console.log(result.data);
            // console.log(result.data.user_id);
            // console.log(result.data.app_id);
            // console.log(result.data.data);
            // console.log(result.data.data.user_id);
            // console.log(result.data.data.app_id);
            const user_id = result.data.data.user_id;
            const app_id = result.data.data.app_id
            return axios.get('https://graph.facebook.com/me', {
                params: {
                    fields: 'email',
                    access_token: access_token
                }
            });
            console.log(result.data);
            res.status(200).json({result: result.data });
        })
        .then(result => {
            console.log(result);
            res.status(200).json({result:result});
         })
        .catch(err => {
            console.log(err);
        });
    // console.log(req.body);
    // res.json({body: req.body});
};