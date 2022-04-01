'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.cookie('cookie', 'looks good');
    res.render('index', { title: 'Express' });
});

router.get('/media/:file', function (req, res) {
    var path = __dirname;
    path = path.replace("routes", "");
    res.sendFile(path + "/controllers/media/" + req.params.file);
});

router.get('/req', function (req, res) {
    res.render('index', { title: req.cookies.cookie });
});

router.get('/LogOut', function (req, res) {
    res.clearCookie('cookie');
    res.render('index', { title: 'Logout' });
});

module.exports = router;
