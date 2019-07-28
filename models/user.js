const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    googleId: {
        type: String
    } ,
    username: {
        type: String
    },
    tabatas: [
        {
            name: {
                type: String,
                required: true
            },
            details: 
                {
                    work: {
                        type: Number,
                        required: true
                    },
                    rest: {
                        type: Number,
                        required: true
                    },
                    rounds: {
                        type: Number,
                        required: true
                    },
                    prepare: {
                        type: Number,
                        required: true
                    }
                }
           ,
            description: {
                type: String,
                required: false
            },
        
        },
        
    ]
    
});

module.exports = mongoose.model('User', userSchema);