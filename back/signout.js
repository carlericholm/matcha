var express = require('express');

var router = express.Router();
var con = require('../config/database');


router.get("/", function(req, res) {
	req.signout();
	res.redirect("/")
})


module.exports = router