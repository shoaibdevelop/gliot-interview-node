var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var sha1 = require('sha1');
var User = mongoose.model('User');
var config = require('../config');
var util = require('../Util/util.message.js');


exports.signin = function (req, res, next) {

    var obj = req.body;

    var user = obj.username;
    var pass = sha1(obj.password + config.salt).toString();

    var result = 0;
    User.find({ username: user, password: pass },
        function (err, response) {
            if (err) { return next(err); }

            else if (response.length) {
                sendUserToken(res, response[0]);
                
            }
            else {
                res.status(200);
                res.json(util.error("invalid username or password"));
            }

        });


    // res.send("username: " + user + "  password: " + password);
};


exports.recover = function (req, res, next) {

    var obj = req.body;

    var Email = obj.email;

    var result = 0;
    User.find({ email: Email },
        function (err, response) {
            if (err) { return next(err); }

            else if (response.length) {
               // res.json(util.success(response[0]));
            }
            else {
                res.status(200);
                res.json(util.error("invalid email"));
            }

        });


    // res.send("username: " + user + "  password: " + password);
};



exports.signup = function (req, res, next) {

    console.log(req.body);
    var obj = req.body;

    var username = obj.username;
    var email = obj.email;

    findByUsername(username, function (IsUser) {
        console.log("is User:   " + IsUser);
        if (IsUser != 0) {
            res.json(util.error("username already exists"));
            
        }
        else {

            findByEmail(email, function (IsEmail) {

                if (IsEmail != 0) {
                    res.status(200);
                    res.json(util.error("email already exists"));

                }
                else {
                    obj.password = sha1(obj.password + config.salt).toString();
                    saveUser(obj, res);
                  
                }
            });


        }

    });



};


exports.find = function (req, res, next) {

    // var username = req.params.username;
    var username = "ali";
    var IsUser = findByUsername(username, function (IsUser) {

        if (IsUser != 0) {
            res.send("user exists");
        }
        else {
            res.send("user not exists");
        }

    });

};

var findByUsername = function (user, callback) {
    //sync.fiber(function () {
        var len = 0;
        console.log("find my username called");
        User.find({ username: user },
            "name",
            function (err, response) {
                if (err) {
                     console.log(err);
                }
                else {
                    console.log("resp len:   " + response.length)
                    callback(response.length);
                }
                    
            });
    //});
};

var findByEmail = function (e, callback) {
    //sync.fiber(function () {
        var len = 0;

        User.find({ email: e },
            "name",
            function (err, response) {
                callback(response.length);
            });
    //});
};

var saveUser = function (obj, res) {

    var newUser = new User({
        username: obj.username,
        password: obj.password,
        email: obj.email,
        name: obj.name
    });


    newUser.save(function (err, post) {
        if (err) {
            res.status(200);
            res.json(util.error("unable to register user"));
        }
        else {
            sendUserToken(res, post);
         }

    });
};

exports.logout = function (req, res, next) {

    res.clearCookie('token');
    res.json(util.success("Logout Successfully"));
};


exports.test = function (req, res) {


    var obj = req.body;

    var newUser = new User(obj);

    /*
    var newUser = new User({
        username: obj.username,
        password: obj.password,
        email: obj.email,
        name: obj.name
    });
    */

    newUser.save(function (err, post) {
        if (err) { return next(err); }

        res.send("Registration Successful");
    });
};


exports.getAll = function (req, res, next) {

    var obj = req.body;

    var query = User.find(obj).sort({ _id: -1 });

    query.exec(function (err, response) {
        if (err) {
            return next(err);
        }
        else {
            res.json(response);
        }
    });
};


exports.addRoles = function (req, res, next) {

    var obj = req.body;

    var query = { _id: obj._id },
        update = obj,
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

    //delete update.expire;

    User.findOneAndUpdate(query, { $set: update }, options, function (err, result) {
        if (err) { return next(err); }
        res.json(util.success(result));
    });

};

var sendUserToken = function (res, user) {
    var payload = {
        user: user
    };
    var token = jwt.sign(payload, config.secret, {
        // expires: 60 // expires in 24 hours
    });

    res.cookie('token', token);
    var tmpRes = util.success(user);
    tmpRes.token = token;
    res.json(tmpRes);
}
