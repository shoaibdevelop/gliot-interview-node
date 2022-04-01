var mongoose = require('mongoose');

var ReleaseSchema = new mongoose.Schema({}, { strict: false });

mongoose.model('Release', ReleaseSchema);