var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    name: String
},
    { strict: false });

mongoose.model('User', UserSchema);