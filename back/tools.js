var con = require('../config/database');

module.exports = {
	getUser: function (login, callback)
	{
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [login], function (err, result) {
			return callback(result);
		})
	},

	getTags: function(login, callback)
	{
		var sql = "SELECT * FROM tags WHERE login = ?";
		con.query(sql, [login], function (err, result) {
			return callback(result);
		})
	},

	getLikes: function(liker_id, callback)
	{
		var sql = "SELECT * FROM likes WHERE liker_id = ?";
		con.query(sql, [liker_id], function (err, result) {
			return callback(result);
		})
	},

	getBlock: function(blocker_id, callback)
	{
		var sql = "SELECT * FROM block WHERE blocker_id = ?";
		con.query(sql, [blocker_id], function (err, result) {
			return callback(result);
		})
	},

	getReport: function(reporter_id, callback)
	{
		var sql = "SELECT * FROM report WHERE reporter_id = ?";
		con.query(sql, [reporter_id], function (err, result) {
			return callback(result);
		})
	},

	getPicsUsersJoin: function(sexe, orientation, callback)
	{
		if (sexe == 0)
		{
			var sql = "SELECT * FROM pics INNER JOIN users on pics.login = users.login WHERE orientation = ? ORDER BY age";
			con.query(sql, [orientation], function (err, result) {
				return callback(result);
			})
		}
		else
		{
			var sql = "SELECT * FROM pics INNER JOIN users on pics.login = users.login WHERE sexe = ? AND orientation = ? ORDER BY age";
			con.query(sql, [sexe, orientation], function (err, result) {
				return callback(result);
			})
		}
	},

	getPicsUsersJoinFilter: function(sexe, orientation, ageMin, ageMax, sort, callback)
	{
		if (sort == 'popularite')
		{
			if (sexe == 0)
			{
				var sql = "SELECT * FROM pics INNER JOIN users on pics.login = users.login WHERE orientation = ? AND age >= ? AND age <= ? ORDER BY " + sort + " DESC";
				con.query(sql, [orientation, ageMin, ageMax], function (err, result) {
					return callback(result);
				})
			}
			else
			{
				console.log("hello");
				console.log(sort);
				var sql = "SELECT * FROM pics INNER JOIN users on pics.login = users.login WHERE sexe = ? AND orientation = ? AND age >= ? AND age <= ? ORDER BY " + sort + " DESC";
				con.query(sql, [sexe, orientation, ageMin, ageMax], function (err, result) {
					console.log(result);
					return callback(result);
				})
			}
		}
		else
		{
			if (sexe == 0)
			{
				var sql = "SELECT * FROM pics INNER JOIN users on pics.login = users.login WHERE orientation = ? AND age >= ? AND age <= ? ORDER BY " + sort;
				con.query(sql, [orientation, ageMin, ageMax], function (err, result) {
					return callback(result);
				})
			}
			else
			{
				var sql = "SELECT * FROM pics INNER JOIN users on pics.login = users.login WHERE sexe = ? AND orientation = ? AND age >= ? AND age <= ? ORDER BY " + sort;
				con.query(sql, [sexe, orientation, ageMin, ageMax], function (err, result) {
					return callback(result);
				})
			}
		}
	}
}

















