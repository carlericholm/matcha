var express = require('express');

var router = express.Router();
var con = require('../config/database');




router.post("/", function(req, res) {
	if (req.body.likeId)
	{
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [req.session.log], function(err, result) {
			var likerId = result[0].id;
			var sql = "INSERT INTO likes SET liked_id = ?, liker_id = ?";
			con.query(sql, [req.body.likeId, likerId]);
		})
	}
})


module.exports = router






























