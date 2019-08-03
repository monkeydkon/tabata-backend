const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    expire_at: {
        type: Date, 
        default: Date.now, 
        expires: 43200
    }
});

module.exports = mongoose.model('Token', tokenSchema);