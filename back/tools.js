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

	getTagScore: function(users, result, callback)
	{
		con.query('SELECT * FROM tags', function(err, tag){
			
			var i = 0;
			var j = 0;
			var nb = 0;
			var number = 0;
			var biggest = 0;
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
				if (result[i].tagScore > biggest)
					biggest = result[i].tagScore;
				nb = 0;
				i++;
			}
			i = 0;
			while (result[i])
			{
				number = (((result[i].tagScore) / biggest) * 100);
				result[i].matchingScore += (number / 3);
				i++;
			}
			return callback(result);
		});
	},

	getDistanceScore: function(users, myLat, myLong, result)
	{
		var biggest = 0;
		var mypoint = new geopoint(myLat, myLong);
		var nb = 0;
		i = 0;

		while (result[i])
		{
			point2 = new geopoint(result[i].latitude, result[i].longitude)
			result[i].distance = mypoint.distanceTo(point2, true)
			if (result[i].distance > biggest)
				biggest = result[i].distance;
			if (!result[i].distance)
				result[i].distance = 0;
			i++;
		}
		i = 0;
		while (result[i])
		{
			nb = (((result[i].distance) / biggest) * 100);
			result[i].matchingScore = ((100 - nb) / 2);
			i++;
		}
		return result;
	},

	getPopularityScore: function(result)
	{
		var i = 0;
		var biggest = 0;
		var nb = 0;
		while (result[i])
		{
			if (result[i].popularite > biggest)
				biggest = result[i].popularite;
			i++;
		}
		i = 0;
		while (result[i])
		{
			nb = (((result[i].popularite) / biggest) * 100);
			result[i].matchingScore += (nb / 5);
			i++;
		}
		return result;
	},

	getSortedMatchingScoreList: function (users, myLat, myLong, result, callback)
	{
		var distanceScoreList = this.getDistanceScore(users, myLat, myLong, result);
		var popularityScoreList = this.getPopularityScore(distanceScoreList);
		this.getTagScore(users, popularityScoreList, function(result){
			var tagScoreList = result;
			return callback(tagScoreList.sort(function bestMatch(first, second)
			{
				if (first.matchingScore == second.matchingScore)
					return 0;
				if (first.matchingScore > second.matchingScore)
					return -1;
				else
					return 1; 
			}));
		});
	},


	getFilteredResults: function(ageMin, ageMax, popMin, popMax, sort, result, callback)
	{
		if (sort == 'age')
		{
			console.log("ici");
			return callback(result.sort(function sortAge(first, second)
			{
				if (first.age == second.age)
					return 0;
				if (first.age < second.age)
					return -1;
				else
					return 1; 
			}));
		}
		if (sort == 'localisation')
		{

			console.log("ici");
			return callback(result.sort(function sortAge(first, second)
			{
				if (first.distance == second.distance)
					return 0;
				if (first.distance < second.distance)
					return -1;
				else
					return 1; 
			}));
		}
		if (sort == 'popularite')
		{
			console.log("ici");
			return callback(result.sort(function sortAge(first, second)
			{
				if (first.popularite == second.popularite)
					return 0;
				if (first.popularite > second.popularite)
					return -1;
				else
					return 1; 
			}));
		}
		if (sort == 'tags')
		{
			console.log("ici");
			return callback(result.sort(function sortAge(first, second)
			{
				if (first.tagScore == second.tagScore)
					return 0;
				if (first.tagScore > second.tagScore)
					return -1;
				else
					return 1; 
			}));
		}
	}
}

















