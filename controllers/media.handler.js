var mongoose = require('mongoose');
var fs = require("fs");
var util = require('../Util/util.message.js');
var dateTime = require('node-datetime');
var config = require('../config');
var jwt = require('jsonwebtoken');
//const cryptoRandomString = require('crypto-random-string');
var MediaSchema = new mongoose.Schema({}, { strict: false });

exports.mediaHandler = function (req, res, next) {

    var mediaArr = [];
    var data = '';
    var files = req.files;
    var c = 0;
    var dt = dateTime.create();
    //var cUser;
    //getCurrentUser(req, res, function (usr) {
      //  cUser = usr;
    //});


    for (var i = 0; i < req.files.length; i++) {
        //sync.fiber(function () {
            var tmpfile = req.files[i];
            tmpfile.originalname = fileNameGen(tmpfile.originalname);
            var file = __dirname + "/media/" + tmpfile.originalname;
            fs.readFile(tmpfile.path, function (err, data) {
                if (err) {
                    res.json(util.error("unable to upload file" + err));
                }
                else {
                    fs.writeFile(file, data, function (err) {
                        if (err) {
                            res.json(util.error("unable to upload file" + err));
                        } else {
                            var tmp = {
                                filename : tmpfile.originalname,
                                path : "media/" + tmpfile.originalname,
                                url : req.connection.remoteAddress + ":" + req.connection.remotePort + "/media/" + tmpfile.originalname,
                                type : tmpfile.mimetype,
                                dateTime : dt.format('d-m-Y H:M:S'),
                               // uploadBy : cUser._id
                            };
                            saveMedia(tmp);
                            mediaArr.push(tmp);
                            c++;
                            if (c == (req.files.length)) {
                                var data = {};
                                data.media = mediaArr;
                                res.json(util.success(data));
                            }
                        }

                    });
                }
            });
        //});
    }
};


var fileNameGen = function (file) {
    var tmp = file.split('.');
    //return tmp[0] + "_" + cryptoRandomString(24) + '.' + tmp[1];
}

var getCurrentUser = function (req, res, callback) {
    //sync.fiber(function () {
        jwt.verify(req.cookies.token, config.secret, function (err, decoded) {
            if (err) {
                res.clearCookie('token');
                res.status(200);
                res.json(util.error("Bad Request"));
                return null;
            }
            else {
                callback(decoded.user[0]);
            }
        });
    //});
}

var saveMedia = function (obj) {

    var mediaModel = mongoose.model('media', MediaSchema);
    var newMedia = new mediaModel(obj);

    newMedia.save(function (err, post) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(post);
        }

    });
};

