const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());

// app.use((req, res, next) =>{
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// });

app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});

mongoose.connect('mongodb+srv://monkeydkon:gamotonzaxa@cluster0-8hu3a.mongodb.net/')
    .then(result => {
        const server = app.listen(3000);
    }).catch(err => {
        console.log(err);
    });
