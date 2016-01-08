/**
 * Created by Jonatan on 22/12/2015.
 */

var express = require('express');
var router = express.Router();

// SET HEADERS

router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

// SET DEFAULT

router.route('/')
    .get(function (req, res) {
        res.sendFile('./public/index.html');
    });

module.exports = router;