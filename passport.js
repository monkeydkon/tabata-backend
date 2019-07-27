const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./models/user');


passport.use(new GoogleStrategy({
    clientID: ' 918021882776-fu8hr3q5ld81t1dlv1pd8en7ht8hu3t6.apps.googleusercontent.com ',
    clientSecret: '7cZdgcIDGsspvQWiKTGoRGTp',
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));