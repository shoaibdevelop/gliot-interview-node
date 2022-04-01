'use strict';
var express = require('express');
var router = express.Router();
var site = require('../controllers/sites.controller.js');

/* GET users listing. */
router.post('/', function (req, res) {
    res.send("get POST req user: " + JSON.stringify(req.body));
});

router.post('/getAll', site.getAll);
router.post('/manage', site.manage);

module.exports = router;
