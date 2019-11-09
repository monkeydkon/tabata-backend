const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const randtoken = require('rand-token');

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
                exp: 1000 * 60 * 60 * 24,
                data: {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString()
                }

            }, process.env.JWT_SECRET);
            // const refreshToken = jwt.sign({
            //     exp: 7 * 1000 * 60 * 60 * 24,
            //     data: {
            //         email: loadedUser.email,
            //         userId: loadedUser._id.toString()
            //     }
            // });
            res.status(200).json({ token, userId: loadedUser._id.toString() });     //send back token
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.refreshToken = (req, res, next) => {

}

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
                html: '<h1>Please verify your account by clicking the link: \nhttp:\/\/' + 'localhost:8080' + '\/auth/confirmation\/' + result.token + '.\n </h1>'
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

exports.getCheckEmail = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                const error = new Error('This email is already being used');
                error.statusCode = 409;
                throw error;
            }
            res.status(200).json({ message: 'Email is available' });
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
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('We were unable to find a user for this token.');
                error.statusCode = 400;
                throw error;
            }
            if (user.verified) {
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

exports.changePassword = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const userId = req.userId
    let loadedUser;
    User.findOne({ _id: userId })
        .then(user => {
            if (!user) {
                const error = new Error('We were unable to find this user.');
                error.statusCode = 400;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(oldPassword, loadedUser.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('This is not your password. Please try again.');
                error.statusCode = 401;
                throw error;
            }
            return bcrypt.hash(newPassword, 12);
        })
        .then(newHashedPassword => {
            loadedUser.password = newHashedPassword;
            return loadedUser.save();
        })
        .then(result => {
            res.status(200).json({ message: 'You changed the password successfully' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.reset = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('We were unable to find this user.');
                error.statusCode = 400;
                throw error;
            }
            const token = new Token({ userId: user._id, token: crypto.randomBytes(18).toString('hex') });
            return token.save();
        })
        .then(result => {
            //console.log(result.token);
            return transporter.sendMail({
                to: email,
                from: 'no-reply@tabata.com',
                subject: 'Reset your password',
                html: '<h1>To set a new password, please click on this link: \nhttp:\/\/' + 'localhost:8080' + '\/auth/reset\/' + result.token + '.\n </h1>'
            });
        })
        .then(result => {
            res.status(200).json({ message: 'Reset email was sent to the email of the user.' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.postReset = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const token = req.body.token;
    const password = req.body.password;
    let loadedToken;
    let loadedUser;
    Token.findOne({ token: token })
        .then(token => {
            if (!token) {
                const error = new Error('There is no such token. Maybe it expired. Please try again.')
                error.statusCode = 401;
                throw error;
            }
            loadedToken = token;
            const userId = loadedToken.userId;
            return User.findById(userId);
        })
        .then(user => {
            if (!user) {
                const error = new Error('There is no such user.')
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.hash(password, 12);
        })
        .then(hashedPassword => {
            loadedUser.password = hashedPassword;
            return loadedUser.save();
        })
        .then(result => {
            return Token.findOneAndDelete({ token: loadedToken.token });
        })
        .then(result => {
            res.status(200).json({ message: 'User changed password successfully' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};