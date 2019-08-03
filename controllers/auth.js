const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
    })
);

const User = require('../models/user');
const Token = require('../models/token');

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('There is no user with this email');
                error.statusCode = 401;
                throw error;
            }
            if (!user.verified) {
                const error = new Error('User is not verified');
                error.statusCode = 401;
                throw error;
            }
            //return console.log(user.verified);
            loadedUser = user;
            return bcrypt.compare(password, user.password)
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }
            // if password is correct generate a JWT
            const token = jwt.sign({
                email: loadedUser.email, userId: loadedUser._id.toString()
            }, 'secret',
                {
                    expiresIn: '1h'
                });
            res.status(200).json({ token: token, userId: loadedUser._id.toString() });     //send back token
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword
            });
            return user.save();
        })
        .then(result => {
            // res.status(201).json({ message: 'user created', userId: result._id });
            const token = new Token({ userId: result._id, token: crypto.randomBytes(16).toString('hex') });
            return token.save();
        })
        .then(result => {
            return transporter.sendMail({
                to: email,
                from: 'no-reply@tabata.com',
                subject: 'Confirm your account',
                html: '<h1>Please verify your account by clicking the link: \nhttp:\/\/' + 'localhost:3000' + '\/auth/confirmation\/' + result.token + '.\n </h1>'
            });
        })
        .then(result => {
            res.status(200).json({ message: 'User signed up and was sent a verification e-mail' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.confirm = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    let loadedToken;
    Token.findOne({ token: req.body.token })
        .then(token => {
            if (!token) {
                const error = new Error('We could not find a user with this token. Maybe this token is expired');
                error.statusCode = 400;
                throw error;
            }
            loadedToken = token;
            return User.findOne({ _id: token.userId });
        })
        .then(user => {
            if (!user) {
                const error = new Error('We were unable to find a user for this token.');
                error.statusCode = 400;
                throw error;
            }
            if (user.verified) {
                return res.status(400).json({ message: 'This user has already been verified.' });
            }
            user.verified = true;
            return user.save();
        })
        .then(result => {
            return loadedToken.deleteOne({ token: loadedToken.token });
        })
        .then(result => {
            res.status(200).json({ message: 'The account has been verified. Please log in.' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.resend = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    User.findOne({email: email})
        .then(user => {
            if(!user){
                const error = new Error('We were unable to find a user for this token.');
                error.statusCode = 400;
                throw error;
            }
            if(user.verified){
                const error = new Error('This user is already verified. Try logging in.');
                error.statusCode = 400;
                throw error;
            }

            const token = new Token({ userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            return token.save();
        })
        .then(result => {
            return transporter.sendMail({
                to: email,
                from: 'no-reply@tabata.com',
                subject: 'Confirm your account',
                html: '<h1>Please verify your account by clicking the link: \nhttp:\/\/' + 'localhost:3000' + '\/auth/confirmation\/' + result.token + '.\n </h1>'
            });
        })
        .then(() => {
            res.status(200).json({ message: 'Verification e-mail was resent' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};