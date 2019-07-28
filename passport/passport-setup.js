const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../variables/keys');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

passport.serializeUser((user,done) => {
    done(null, user.id);
});

passport.deserializeUser((id,done) => {
    User.findById(id)
        .then(user => {
            done(null,user);
        })
        .catch(err => {
            console.log(err);
        });
});

passport.use(
    new GoogleStrategy({
        //options for the google strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        //check if user existsnp
        User.findOne({ googleId: profile.id })
            .then(currentUser => {
                if (currentUser) {
                    return done(null, currentUser);
                } else {
                    new User({
                        username: profile.displayName,
                        googleId: profile.id
                    }).save()
                        .then(newUser => {
                            done(null, newUser);
                            // res.status(200).json({message: 'user created'});
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            })
    })
);