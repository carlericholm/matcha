var express = require('express');

var router = express.Router();
var con = require('../config/database');




router.post("/", function(req, res) {
	if (req.body.blockId)
	{
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [req.session.log], function(err, result) {
			var blockerId = result[0].id;
			var sql = "INSERT INTO block SET blocked_id = ?, blocker_id = ?";
			con.query(sql, [req.body.blockId, blockerId]);
			var sql = "UPDATE users SET popularite = popularite - 5 WHERE id = ?";
			con.query(sql, [req.body.blockId]);
		})
	}
})


module.exports = router




