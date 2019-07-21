const { validationResult } = require('express-validator/check');

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    res.status(200).json({email: email, password: password});
};

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    res.status(200).json({test: "works"});
};