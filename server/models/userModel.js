const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    
    email: {
        type: String,
        required: true

    },
    roles: {
        type: String,
    },
    password: {
        type: String,
        required: true

    },
    refreshToken: String

    
}, {timestamps: true});
var UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;