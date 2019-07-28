const express = require('express');

const { body } = require('express-validator/check');

const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

const passport = require('passport');


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

router.get('/google', passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email']
}));

router.get('/google/redirect',passport.authenticate('google'),(req,res) => {
    isAuth.signToken(req, res);
});

// router.get('/verify',isAuth.checkTokenMW, (req, res) => {
//     isAuth.verifyToken(req, res);
//     if (null === req.authData) {
//         res.sendStatus(403);
//     } else {
//         res.json(req.authData);
//     }
// });

module.exports = router;
