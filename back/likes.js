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
	if (req.body.unlikeId)
	{
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [req.session.log], function(err, result) {
			var likerId = result[0].id;
			var sql = "DELETE FROM likes WHERE liked_id = ? AND liker_id = ?";
			con.query(sql, [req.body.unlikeId, likerId]);
		})
	}
	if (req.body.visitId)
	{
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [req.session.log], function(err, result) {
			var visiterId = result[0].id;
			var sql = "INSERT INTO visits SET visited_id = ?, visiter_id = ?";
			con.query(sql, [req.body.visitId, visiterId]);
		})
	}
})


module.exports = router






























