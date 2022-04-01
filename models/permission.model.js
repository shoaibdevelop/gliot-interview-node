var mongoose = require('mongoose');

var PermissionSchema = new mongoose.Schema({}, { strict: false });

mongoose.model('Permission', PermissionSchema);