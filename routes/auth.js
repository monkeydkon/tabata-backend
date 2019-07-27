const express = require('express');

const { body } = require('express-validator/check');

const User = require('../models/user');

const authController = require('../controllers/auth');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


passport.use(new GoogleStrategy({
    clientID: '918021882776-fu8hr3q5ld81t1dlv1pd8en7ht8hu3t6.apps.googleusercontent.com',
    clientSecret: ' HSogVkVFdTdKWAhbO3t6Yz7F ',
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

const router = express.Router();

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
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;