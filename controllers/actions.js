const User = require('../models/user');

exports.getTabatas = (req, res, next) => {
    const userId = req.userId;
    User.findById(userId)
        .then(user => {
            if(!user){
                const error = new Error('User doesnt exist');
                error.statusCode = 500;
                throw error;
            }
            res.status(200).json({result: user.tabatas});
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getTabata = (req, res, next) => {
    // const userId = req.userId;
    // const tabataId = req.params.tabataId;
    // if(!tabataId){
    //     const error = new Err
    // }
};

exports.postTabata = (req, res, next) => {
    const userId = req.userId;
    const name = req.body.name;
    const active = req.body.active;
    const passive = req.body.passive;
    const rounds = req.body.rounds;
    const description = req.body.description;
    User.findById(userId)
        .then(user => {
            if(!user){
                const error = new Error('This user doesnt exist');
                error.statusCode = 404;
                throw error;
            }
            const tabata = {name: name, description: description, details:{active:active,passive:passive,rounds:rounds}};
            user.tabatas.push(tabata);
            return user.save();
        })  
        .then(result => {
           res.status(200).json(result);
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
        
        
};