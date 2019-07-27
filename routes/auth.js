const express = require('express');

const { body } = require('express-validator/check');

const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;



router.put('/signup',
 [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid e-mail')
        .custom((value, { req }) => {
            return User.findOne({email: value})
                .then(userDoc => {
                    if (userDoc){
                        return Promise.reject('This e-mail adress is already being used');
                    }
                })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({min: 5})
        .withMessage('Password must be at least 5 charactes')
], 
authController.signup);

router.post('/login', authController.login);

router.get('/google',
  passport.authenticate('google', { scope: 
      [ 'https://www.googleapis.com/auth/plus.login',
      , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
));

router.get('/google/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

module.exports = router;