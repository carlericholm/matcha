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
			var sql = "UPDATE users SET popularite = popularite + 3 WHERE id = ?";
			con.query(sql, [req.body.likeId]);
		})
	}
	if (req.body.unlikeId)
	{
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [req.session.log], function(err, result) {
			var likerId = result[0].id;
			var sql = "DELETE FROM likes WHERE liked_id = ? AND liker_id = ?";
			con.query(sql, [req.body.unlikeId, likerId]);
			var sql = "UPDATE users SET popularite = popularite - 3 WHERE id = ?";
			con.query(sql, [req.body.unlikeId]);
		})
	}
	if (req.body.visitId)
	{
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [req.session.log], function(err, result) {
			var visiterId = result[0].id;
			var sql = "SELECT * FROM visits WHERE visited_id = ? AND visiter_id = ?";
			con.query(sql, [req.body.visitId, visiterId], function (err, result) {
				if (result.length > 0)
				{
					var sql = "UPDATE visits SET date = ? WHERE visited_id = ? AND visiter_id = ?";
					var date = new Date();
					con.query(sql, [date, req.body.visitId, visiterId]);
					var sql = "UPDATE users SET popularite = popularite + 1 WHERE id = ?";
					con.query(sql, [req.body.visitId]);
				}
				else
				{
					var sql = "INSERT INTO visits SET visited_id = ?, visiter_id = ?";
					con.query(sql, [req.body.visitId, visiterId]);
					var sql = "UPDATE users SET popularite = popularite + 1 WHERE id = ?";
					con.query(sql, [req.body.visitId]);
				}
			})
		})
	}
})


module.exports = router






























