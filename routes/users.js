'use strict';
var express = require('express');
var router = express.Router();
var user = require('../controllers/user.controller.js');

/* GET users listing. */
router.post('/', function (req, res) {
    res.send("get POST req user: " + JSON.stringify(req.body));
});


router.post('/signup', user.signup);
router.post('/signin', user.signin);
router.post('/recover', user.recover);
router.post('/logout', user.logout);
//router.post('/test', user.test);
//router.post('/getAll', user.getAll);
//router.post('/addRoles', user.addRoles);

module.exports = router;
