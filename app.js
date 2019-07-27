const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const url = require('./variables/variables');
const User = require('./models/user');

const authRoutes = require('./routes/auth');
const actionsRoutes = require('./routes/actions');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;



const app = express();



app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});



passport.use(new GoogleStrategy({
    clientID: '918021882776-fu8hr3q5ld81t1dlv1pd8en7ht8hu3t6.apps.googleusercontent.com',
    clientSecret: 'HSogVkVFdTdKWAhbO3t6Yz7F',
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });

        console.log(profile.id);
    }
));

app.use( passport.initialize());
app.use( passport.session());


app.use('/auth', authRoutes);
app.use('/actions', actionsRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose.connect(url)
    .then(result => {
        const server = app.listen(3000);
    }).catch(err => {
        console.log(err);
    });
