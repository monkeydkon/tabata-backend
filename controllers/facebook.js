const axios = require('axios');
const { validationResult } = require('express-validator/check');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

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
    let facebookId;
    let email;
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
                    access_token: process.env.FACEBOOK_ADD_ID
                }
            });
        })
        .then(result => {
            return axios.get('https://graph.facebook.com/me', {
                params: {
                    fields: 'email',
                    access_token: access_token
                }
            });
        })
        .then(result => {
            // console.log(result.data);
            // res.status(200).json({result:result.data});
            facebookId = result.data.id;
            email = result.data.email;
            return User.findOne({ facebookId: result.data.id });

            //todo PUT USER INTO DATABASE
        })
        .then(user => {
            if (!user) {
                const newUser = new User({
                    facebookId: facebookId,
                    email: email,
                    provider: 'facebook'
                })
                return user.save();
            }
        })
        .then(user => {
            const token = jwt.sign({
                email: email, userId: user._id.toString()
            }, process.env.JWT_SECRET,
                {
                    expiresIn: '1h'
                });
            res.status(200).json({ token: token, userId: user._id.toString() });
        })
        .catch(err => {
            console.log(err);
        });
};