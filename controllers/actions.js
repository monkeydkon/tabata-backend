const User = require('../models/user');
const { validationResult } = require('express-validator/check');

exports.getTabata = (req, res, next) => {
    const userId = req.userId;
    const tabataId = req.params.tabataId;
    User.findById(userId)
        .then(user => {
            if(!user){
                const error = new Error('User doesnt exist');
                error.statusCode = 500;
                throw error;
            }
            return user;
        })
        .then(result => {
             const tabata = result.tabatas.find(tabata => tabata._id == tabataId);
             if(!tabata){
                const error = new Error('Tabata doesnt exist');
                error.statusCode = 500;
                throw error;
             }
             res.status(200).json({tabata:tabata});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getTabatas = (req, res, next) => {
    const userId = req.userId;
    User.findById(userId)
        .then(user => {
            if (!user) {
                const error = new Error('User doesnt exist');
                error.statusCode = 500;
                throw error;
            }
            res.status(200).json({ result: user.tabatas });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.postTabata = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        errors.data = errors.array();
        throw error;
    }
    const userId = req.userId;
    const name = req.body.name;
    const work = req.body.work;
    const rest = req.body.rest;
    const rounds = req.body.rounds;
    const prepare = req.body.prepare;
    const description = req.body.description;
    User.findById(userId)
        .then(user => {
            if (!user) {
                const error = new Error('This user doesnt exist');
                error.statusCode = 404;
                throw error;
            }
            const tabata = {
                name: name,
                description: description,
                details: {
                    work: work,
                    rest: rest,
                    rounds: rounds,
                    prepare: prepare
                }
            };
            user.tabatas.push(tabata);
            return user.save();
        }).then(result => {
            res.status(200).json({message: 'new tabata added'});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteTabata = (req, res, next) => {
    const userId = req.userId;
    const tabataId = req.params.tabataId;
    User.findById(userId)
        .then(user => {
            if(!user){
                const error = new Error('This user doesnt exist');
                error.statusCode = 404;
                throw error; 
            }
            const tabata = user.tabatas.findIndex(tabata => tabata._id == tabataId);
             if(tabata == -1){
                const error = new Error('Tabata doesnt exist');
                error.statusCode = 500;
                throw error;
             }
             const updatedTabatas = user.tabatas.splice(tabata, 1);  
             user.updateOne({
                 tabatas: updatedTabatas
             })
             return user.save();
        })
        .then(result => {
            res.status(200).json({message: 'tabata deleted successfully'});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.updateTabata = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        errors.data = errors.array();
        throw error;
    }
    const userId = req.userId;
    const tabataId = req.params.tabataId;
    const name = req.body.name;
    const work = req.body.work;
    const rest = req.body.rest;
    const rounds = req.body.rounds;
    const prepare = req.body.prepare;
    const description = req.body.description;
    User.findById(userId)
        .then(user => {
            if(!user){
                const error = new Error('This user doesnt exist');
                error.statusCode = 404;
                throw error; 
            }
            const tabata = user.tabatas.find(tabata => tabata._id == tabataId);
            if(!tabata){
               const error = new Error('Tabata doesnt exist');
               error.statusCode = 500;
               throw error;
            }     
            tabata.name = name;
            tabata.details.work = work;
            tabata.details.rest = rest;
            tabata.details.rounds = rounds;
            tabata.details.prepare = prepare;
            tabata.description = description;
            return user.save();
        })
        .then(result => {
            res.status(200).json({message: 'tabata updated successfully'});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};