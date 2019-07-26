const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tabatas: [
        {
            name: {
                type: String,
                required: true
            },
            details: 
                {
                    active: {
                        type: Number,
                        required: true
                    },
                    passive: {
                        type: Number,
                        required: true
                    },
                    rounds: {
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