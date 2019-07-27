const User = require('../models/user');


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
            return user
        })
        .then(result => {
        //    const filtered =
            //result.findOne({tabata._id: tabata});
            // return result.findById(result.tabatas._id === tabataId);
            res.json({take: result.tabatas});    
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
            res.status(200).json(result);
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });


};