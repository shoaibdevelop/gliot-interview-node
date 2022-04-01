var mongoose = require('mongoose');

var SettingSchema = new mongoose.Schema({}, { strict: false });

mongoose.model('Setting', SettingSchema);