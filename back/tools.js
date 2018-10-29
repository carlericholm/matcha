 var con = require('../config/database');
 var geopoint = require('geopoint');


 function getPicsUsersJoin (sexe, orientation, callback)
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
 }

 function  getLikes (liker_id, callback)
 {
 	var sql = "SELECT * FROM likes WHERE liker_id = ?";
 	con.query(sql, [liker_id], function (err, result) {
 		return callback(result);
 	})
 }

 function getBlock (blocker_id, callback)
 {
 	var sql = "SELECT * FROM block WHERE blocker_id = ?";
 	con.query(sql, [blocker_id], function (err, result) {
 		return callback(result);
 	})
 }

 function getReport (reporter_id, callback)
 {
 	var sql = "SELECT * FROM report WHERE reporter_id = ?";
 	con.query(sql, [reporter_id], function (err, result) {
 		return callback(result);
 	})
 }

 function getDistanceScore (users, myLat, myLong, result)
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
 }

 function getPopularityScore(result)
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
 }

 function getTagScore(users, result, callback)
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
 }

 function getSortedMatchingScoreList (users, myLat, myLong, result, callback)
 {
 	var distanceScoreList = getDistanceScore(users, myLat, myLong, result);
 	var popularityScoreList = getPopularityScore(distanceScoreList);
 	getTagScore(users, popularityScoreList, function(result){
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
 }

 function getFilteredResults(ageMin, ageMax, popMin, popMax, sort, result, callback)
 {
 	if (sort == 'age')
 	{
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
 	else
 		return callback(result);
 }



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


 	
 	casseCouilles: function(text) {
 		var map = {
 			'&amp;': '&',
 			'&#038;': "&",
 			'&lt;': '<',
 			'&gt;': '>',
 			'&quot;': '"',
 			'&#039;': "'",
 			'&#8217;': "’",
 			'&#8216;': "‘",
 			'&#8211;': "–",
 			'&#8212;': "—",
 			'&#8230;': "…",
 			'&#8221;': '”'
 		};
 		text = text.replace(/\&[\w\d\#]{2,5}\;/g, function(m) { return map[m]; });
 		return text;
 	},

 	getTags: function(login, callback)
 	{
 		var sql = "SELECT * FROM tags WHERE login = ?";
 		con.query(sql, [login], function (err, result) {
 			return callback(result);
 		})
 	},

 	render: function(tags, res, users, sex, orientation)
 	{
 		let age = [0, 0, 100];
 		distance = [0, 0, 10000]
 		popularite = [0, 0, 1000];
 		sort = 'age';
 		getPicsUsersJoin(sex, orientation, function(result) {
 			getSortedMatchingScoreList(users, users[0].latitude, users[0].longitude, result, function (suggestions) {
 				getLikes(users[0].id, function(likes) {
 					getBlock(users[0].id, function (block) {
 						getReport(users[0].id, function (report) {
 							res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
 						})
 					})
 				})
 			})
 		})
 	},

 	renderPost: function(body, tags, res, users, sex, orientation)
 	{
 		var age = body.age.split(" ");
 		var distance = body.distance.split(" ");
 		var popularite = body.popularite.split(" ");
 		if (body.sortButton == 'SORT')
 			var sort = body.sort;
 		else
 			var sort = 0;

 		getPicsUsersJoin('Feminin', 'Héterosexuel', function(result) {
 			getSortedMatchingScoreList(users, users[0].latitude, users[0].longitude, result, function (matchList) {
 				getFilteredResults(age[0], age[2], popularite[0], popularite[2], sort, matchList, function(suggestions) {
 					getLikes(users[0].id, function(likes) {
 						getBlock(users[0].id, function (block) {
 							getReport(users[0].id, function (report) {
 								res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
 							})
 						})
 					})
 				})
 			})
 		})
 	}
 }
