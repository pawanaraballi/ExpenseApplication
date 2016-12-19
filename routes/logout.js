var express = require('express');
var logout = express.Router();


logout.get('/', function (req, res,next) {
    req.session.token = null;

            res.render('pages/logout');
});

module.exports = logout;