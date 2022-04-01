'use strict';
var express = require('express');
var router = express.Router();
var optimizer = require('../controllers/optimizer.controller.js');

var multer = require('multer');
var bodyParser = require('body-parser');


/* GET users listing. */
router.post('/', function (req, res) {
    res.send("get POST req user: " + JSON.stringify(req.body));
});

router.post('/max-sharpe', optimizer.maxSharpe);

module.exports = router;
