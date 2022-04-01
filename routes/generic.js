'use strict';
var express = require('express');
var router = express.Router();
var generic = require('../controllers/generic.controller.js');
var media = require('../controllers/media.handler.js');

var multer = require('multer');
var bodyParser = require('body-parser');
var upload = multer({ dest: '/tmp/' });
var urlencodedParser = bodyParser.urlencoded({ extended: false });


/* GET users listing. */
router.post('/', function (req, res) {
    res.send("get POST req user: " + JSON.stringify(req.body));
});

router.post('/getAll', generic.getAll);
router.post('/manage', generic.manage);
router.post('/media', upload.array('file'), urlencodedParser, media.mediaHandler);

module.exports = router;
