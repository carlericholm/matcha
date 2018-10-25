var con = require('../config/database');
var geopoint = require('geopoint');

module.exports = {
	getUser: function (login, callback)
	{
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [login], function (err, result) {
			con.query('SELECT * FROM tags', function(err, tag) { if (err) throw err; 
				var i = 0;
				var j = 0;
				while (result[i])
				{
					result[i].tags = new Array();
					var onetag = tag.filter(tag => tag.login == result[i].login)
					while (onetag[j])
					{
						result[i].tags.push(onetag[j].tag);
						j++;
					}
					j = 0;
					i++;
				}
				return callback(result);
			})
		});
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
			var sql = "SELECT * FROM pics INNER JOIN users on pics.login = users.login WHERE orientation = ?";
			con.query(sql, [orientation], function (err, result) {
				return callback(result);
			})
		}
		else
		{
			var sql = "SELECT * FROM pics INNER JOIN users on pics.login = users.login WHERE sexe = ? AND orientation = ?";
			con.query(sql, [sexe, orientation], function (err, result) {
				return callback(result);
			})
		}
	},

	settags: function(users, result, callback)
	{
		con.query('SELECT * FROM tags', function(err, tag) { if (err) throw err; 
			var i = 0;
			var j = 0;
			var nb = 0;
			while (result[i])
			{
				result[i].tags = new Array();
				var onetag = tag.filter(tag => tag.login == result[i].login)
				while (onetag[j])
				{
					result[i].tags.push(onetag[j].tag);
					j++;
				}
				j = 0;
				i++;
			}
			i = 0;
			j = 0;
			if (!result[i].tagScore)
				result[i].tagScore = 0;
			while (result[i])
			{
				while (result[i].tags[j])
				{
					if (users[0].tags.indexOf(result[i].tags[j]) !== -1)
					{
						nb += 1;
					}
					j++;
				}
				j = 0;
				result[i].tagScore = nb;
				nb = 0;
				i++;
			}
			return callback(result.sort(function popularity(first, second)
			{
				if (first.tagScore == second.tagScore)
					return 0;
				if (first.tagScore > second.tagScore)
					return -1;
				else
					return 1; 
			}));
		})
	},

	getSortedDistanceList: function (users, myLat, myLong, result, callback)
	{
		var mypoint = new geopoint(myLat, myLong)
		i = 0;
		while (result[i])
		{
			point2 = new geopoint(result[i].latitude, result[i].longitude)
			result[i].distance = mypoint.distanceTo(point2, true)
			if (!result[i].distance)
				result[i].distance = '0';
			i++;
		}
		result.sort(function ascendingdist(first, second)
		{
			if (first.distance == second.distance)
				return 0;
			if (first.distance < second.distance)
				return -1;
			else
				return 1; 
		});
		this.settags(users, result, function (result) {
			console.log(result);
			return callback(result.sort(function popularity(first, second)
			{
				if (first.popularite == second.popularite)
					return 0;
				if (first.popularite > second.popularite)
					return -1;
				else
					return 1; 
			}));
		});
	},

	getPicsUsersJoinFilter: function(sexe, orientation, ageMin, ageMax, popMin, popMax, sort, callback)
	{
		if (sort == 'popularite')
		{
			if (sexe == 0)
			{
				var sql = "SELECT * FROM pics INNER JOIN users on pics.login = users.login WHERE orientation = ? AND age >= ? AND age <= ? AND popularite >= ? AND popularite <= ? ORDER BY " + sort + " DESC";
				con.query(sql, [orientation, ageMin, ageMax, popMin, popMax], function (err, result) {
					return callback(result);
				})
			}
			else
			{
				var sql = "SELECT * FROM pics INNER JOIN users on pics.login = users.login WHERE sexe = ? AND orientation = ? AND age >= ? AND age <= ? AND popularite >= ? AND popularite <= ? ORDER BY " + sort + " DESC";
				con.query(sql, [sexe, orientation, ageMin, ageMax, popMin, popMax], function (err, result) {
					return callback(result);
				})
			}
		}
		else
		{
			if (sexe == 0)
			{
				var sql = "SELECT * FROM pics INNER JOIN users on pics.login = users.login WHERE orientation = ? AND age >= ? AND age <= ? AND popularite >= ? AND popularite <= ? ORDER BY " + sort;
				con.query(sql, [orientation, ageMin, ageMax, popMin, popMax], function (err, result) {
					return callback(result);
				})
			}
			else
			{
				var sql = "SELECT * FROM pics INNER JOIN users on pics.login = users.login WHERE sexe = ? AND orientation = ? AND age >= ? AND age <= ? AND popularite >= ? AND popularite <= ? ORDER BY " + sort;
				con.query(sql, [sexe, orientation, ageMin, ageMax, popMin, popMax], function (err, result) {
					return callback(result);
				})
			}
		}
	}
}

















