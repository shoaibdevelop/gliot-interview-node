var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config');
var util = require('../Util/util.message.js');


module.exports = function (req, res, next) {

    if (req.path == '/users/signup' || req.path == '/users/signin' || req.path == '/users/recover' || req.path == '/generic/media' || req.path.includes('/media') ) {
        next();
    }
    else {

        var token = "";

        if (req.cookies.token) {
            token = req.cookies.token;
        }
        

        if (req.body.token) {
            token = req.body.token;
        }

        jwt.verify(token, config.secret , function (err, decoded) {
            if (err) {
                res.clearCookie('token');
                res.status(200);
                res.json(util.error("Bad Request"));
                return
            } else {
               /* if (decoded.exp <= Date.now()) {
                    res.clearCookie('token');
                    res.status(200);
                    res.json(util.error("Invalid Token"));
                    return;
                }
                else { */
                    next();
               // }
            }
        });

    }
    
}