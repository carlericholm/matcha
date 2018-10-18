var express = require('express');

var router = express.Router();
var con = require('../config/database');




router.post("/", function(req, res) {
	if (req.body.reportId)
	{
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [req.session.log], function(err, result) {
			var reporterId = result[0].id;
			var sql = "INSERT INTO report SET reported_id = ?, reporter_id = ?";
			con.query(sql, [req.body.reportId, reporterId]);
		})
	}
})


module.exports = router




