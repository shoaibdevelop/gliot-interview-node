var mongoose = require('mongoose');
var util = require('../Util/util.message.js');
var config = require('../config');
var jwt = require('jsonwebtoken'); 
var dateTime = require('node-datetime');
//const cryptoRandomString = require('crypto-random-string');

var MainSchema = new mongoose.Schema({}, { strict: false });

exports.getAll = function (req, res, next) {

    var obj = req.body;
    var MainModel = mongoose.model(obj.document, MainSchema);


    var query = "";

    if (!obj.chunk) {
        query = MainModel.find(obj.payload).sort({ createTime: -1 });
    }
    else {
        var pageNo = obj.chunk.no * obj.chunk.size;
        query = MainModel.find(obj.payload).sort({ createTime: -1 }).skip(pageNo).limit(obj.chunk.size);
    }

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
    var MainModel =  mongoose.model(obj.document, MainSchema);

    var cUser;
    getCurrentUser(req, res, function (usr) {
        cUser = usr;
    });

    var query = '';
    var update = obj.payload;
    var dt = dateTime.create();

    if (obj.payload._id) {
        query = { _id: obj.payload._id };
        update.updatedBy = cUser._id;
        update.updateTime = dt.format('d-m-Y H:M:S');
    }
    else {
        var id = mongoose.Types.ObjectId();
        query = { _id: id };
        //query = { };
        update.createdBy = cUser._id;
        update.createTime = dt.format('d-m-Y H:M:S');
    }


    
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

    //delete update.expire;

    MainModel.findOneAndUpdate(query, { $set: update }, options, function (err, result) {
        if (err) { return next(err); }
        res.json(util.success(result));
    });

};
var getCurrentUser = function (req, res , callback) {
    //sync.fiber(function () {
        var token = "";

        if (req.cookies.token) {
            token = req.cookies.token;
        }
        
        if (req.body.token) {
            token = req.body.token;
        }

        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                res.clearCookie('token');
                res.status(200);
                res.json(util.error("Bad Request"));
                return null;
            }
            else {

                callback(decoded.user);
            }
        });
    //});
}
