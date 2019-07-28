const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const passport = require('passport');
const compression = require('compression');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const actionsRoutes = require('./routes/actions');

const app = express();

app.use(helmet());
app.use(compression());

app.use(passport.initialize());

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);
app.use('/actions', actionsRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-8hu3a.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`)
    .then(result => {
        app.listen(process.env.PORT || 3000);
    }).catch(err => {
        console.log(err);
    });
