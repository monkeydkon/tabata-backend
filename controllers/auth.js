exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    res.status(200).json({email: email, password: password});
};