var mongoose = require('mongoose');

var AuditSchema = new mongoose.Schema({}, { strict: false });

mongoose.model('Audit', AuditSchema);