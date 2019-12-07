const express = require('express');

const { body } = require('express-validator/check');

// const User = require('../models/user');

const authController = require('../controllers/auth');

// const googleController = require('../controllers/google');
// const facebookController = require('../controllers/facebook');

// const isAuth = require('../middleware/is-auth');
const verifyFirebaseToken = require('../middleware/verify-firebase-token');

const router = express.Router();

// router.post('/register', verifyFirebaseToken.verify, authController.register);

router.post('/setOrUpdateUserData', verifyFirebaseToken.verify, authController.setOrUpdateUserData);

router.get('/userData', verifyFirebaseToken.verify, authController.getUserData);

// router.put('/signup',
//  [
//     body('email')
//         .isEmail()
//         .withMessage('Please enter a valid e-mail')
//         .custom((value, { req }) => {
//             return User.findOne({email: value})
//                 .then(userDoc => {
//                     if (userDoc){
//                         return Promise.reject('This e-mail adress is already being used');
//                     }
//                 })
//         })
//         .normalizeEmail(),
//     body('password')
//         .trim()
//         .isLength({min: 5})
//         .withMessage('Password must be at least 5 charactes')
// ], 
// authController.signup);

// router.post('/login', authController.login);

// router.get('/checkemail', [body('email').isEmail().normalizeEmail().withMessage('Not a valid email')], authController.getCheckEmail);

// router.post('/change', [body('newPassword').trim().isLength({min: 5}).withMessage('Password must be at least 5 characters')],isAuth.checkAuthentication, authController.changePassword);

// router.post('/confirmation', [body('token').not().isEmpty().withMessage('The token cannot be an empty string')],authController.confirm);

// router.post('/resend',[body('email').isEmail().normalizeEmail().withMessage('Not a valid email')], authController.resend);

// router.post('/reset', [body('email').isEmail().normalizeEmail().withMessage('Not a valid email')],authController.reset);

// router.post('/post-reset', [body('password').trim().isLength({min: 5}).withMessage('Password must be at least 5 characters')],authController.postReset);

// router.post('/google', [body('code').not().isEmpty().withMessage('The code cannot be an empty string')],googleController.getGoogleAccountFromCode);

// router.post('/facebook',
// // [body('code').not().isEmpty().withMessage('The code cannot be an empty string')],
// facebookController.getFacebookAccountFromCode);

module.exports = router;