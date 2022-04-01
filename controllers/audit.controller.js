var mongoose = require('mongoose');
var Audit = mongoose.model('Audit');
var util = require('../Util/util.message.js');

exports.getAll = function (req, res, next) {

    var obj = req.body;

    var query = Audit.find(obj).sort({ _id: -1 });

    query.exec(function (err, response) {
        if (err) {
            return next(err);
        }
        else {
            res.json(response);
        }
    });
};


exports.manage = function (req, res, next) {

    var obj = req.body;

    var query = { _id: obj._id },
        update = obj,
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

    //delete update.expire;

    Audit.findOneAndUpdate(query, { $set: update }, options, function (err, result) {
        if (err) { return next(err); }
        res.json(util.success(result));
    });

};
