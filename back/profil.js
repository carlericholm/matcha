var express = require('express');

var router = express.Router();
var con = require('../config/database');


router.post("/", function(req, res) {
	console.log(req.body.file_profil);
	res.render("index", {pic: req.body.file_profil});
})


module.exports = router