const mongoose = require('mongoose');
const {Schema} = mongoose;

const Login = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile:{
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ipAddress:{
        type: String,
        required: true
    },
    browserLogin:{
        type: String,
        required: true
    },
    lastLoginDate:{
        type: Date,
        required: true,
        default:Date.now()
    }
});

const login = mongoose.model('logins',Login);
module.exports = login;