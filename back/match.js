var express = require('express');
var geopoint = require('geopoint');

var router = express.Router();
var con = require('../config/database');


router.get("/", function(req, res) {
	if (req.session.log !== undefined)
	{
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [req.session.log], function(err, result) {
			var users = result;
			var sql = "SELECT * FROM tags WHERE login = ?";
			con.query(sql, [req.session.log], function(err, result) {
				var tags = result;
				if (users[0].age !== 0 && users[0].sexe !== 'NULL' && users[0].orientation !== 'NULL' && users[0].bio !== 'NULL')
				{
					if (users[0].sexe == 'Masculin')
					{
						if (users[0].orientation == 'Héterosexuel')
						{
							// var sql = "SELECT * FROM users WHERE sexe = 'Feminin' AND orientation = 'Héterosexuel'";
							var sql = "SELECT * FROM pics INNER JOIN users on pics.login = users.login WHERE sexe = 'Feminin' AND orientation = 'Héterosexuel'";
							con.query(sql, function(err, result) {
								var suggestions = result;
								var sql = "SELECT * FROM likes WHERE liker_id = ?";
								con.query(sql, [users[0].id], function(err, result) {
									var likes = result;
									var sql = "SELECT * FROM block WHERE blocker_id = ?";
									con.query(sql, [users[0].id], function(err, result) {
										var block = result;
										var sql = "SELECT * FROM report WHERE reporter_id = ?";
										con.query(sql, [users[0].id], function(err, result) {
											var report = result;
											console.log(report);
											res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report});
										})
									})

									// res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes});
								})
							})
						}
						if (users[0].orientation == 'Homosexuel')
						{
							var sql = "SELECT * FROM pics INNER JOIN users on pics.login = users.login WHERE sexe = 'Masculin' AND orientation = 'Homosexuel'";
							con.query(sql, function(err, result) {
								var suggestions = result;
								var sql = "SELECT * FROM likes WHERE liker_id = ?";
								con.query(sql, [users[0].id], function(err, result) {
									var likes = result;
									var sql = "SELECT * FROM block WHERE blocker_id = ?";
									con.query(sql, [users[0].id], function(err, result) {
										var block = result;
										res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block});
									})
								})
							})
						}
						if (users[0].orientation == 'Bisexuel')
						{
							var sql = "SELECT * FROM users INNER JOIN pics on users.login = pics.login WHERE orientation = 'Bisexuel'";
							con.query(sql, function(err, result) {
								var suggestions = result;
								var sql = "SELECT * FROM likes WHERE liker_id = ?";
								con.query(sql, [users[0].id], function(err, result) {
									var likes = result;
									var sql = "SELECT * FROM block WHERE blocker_id = ?";
									con.query(sql, [users[0].id], function(err, result) {
										var block = result;
										res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block});
									})
								})
							})
						}

					}
					if (users[0].sexe == 'Feminin')
					{
						if (users[0].orientation == 'Héterosexuel')
						{
							var sql = "SELECT * FROM users INNER JOIN pics on users.login = pics.login WHERE sexe = 'Masculin' AND orientation = 'Héterosexuel'";
							con.query(sql, function(err, result) {
								var suggestions = result;
								var sql = "SELECT * FROM likes WHERE liker_id = ?";
								con.query(sql, [users[0].id], function(err, result) {
									var likes = result;
									var sql = "SELECT * FROM block WHERE blocker_id = ?";
									con.query(sql, [users[0].id], function(err, result) {
										var block = result;
										res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block});
									})
								})
							})
						}
						if (users[0].orientation == 'Homosexuel')
						{
							var sql = "SELECT * FROM users INNER JOIN pics on users.login = pics.login WHERE sexe = 'Feminin' AND orientation = 'Homosexuel'";
							con.query(sql, function(err, result) {
								var suggestions = result;
								var sql = "SELECT * FROM likes WHERE liker_id = ?";
								con.query(sql, [users[0].id], function(err, result) {
									var likes = result;
									var sql = "SELECT * FROM block WHERE blocker_id = ?";
									con.query(sql, [users[0].id], function(err, result) {
										var block = result;
										res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block});
									})
								})
							})
						}
						if (users[0].orientation == 'Bisexuel')
						{
							var sql = "SELECT * FROM users INNER JOIN pics on users.login = pics.login WHERE orientation = 'Bisexuel'";
							con.query(sql, function(err, result) {
								var suggestions = result;
								var sql = "SELECT * FROM likes WHERE liker_id = ?";
								con.query(sql, [users[0].id], function(err, result) {
									var likes = result;
									var sql = "SELECT * FROM block WHERE blocker_id = ?";
									con.query(sql, [users[0].id], function(err, result) {
										var block = result;
										res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block});
									})

								})
							})
						}

					}
				}
				else
				{
					res.render("match", {info: users[0], tags: tags, fillProfile: "Veuillez completer votre profil avant de recevoir des suggestions"});
				}
			})
})
}
})

router.post("/", function(req, res) {
	var sql = "SELECT * FROM users WHERE login = ?";
	con.query(sql, [req.session.log], function (err, result) {
		if (result[0].age !== 0 && result[0].sexe !== 'NULL' && result[0].orientation !== 'NULL' && result[0].bio !== 'NULL')
		{
			console.log("ok");
		}
		else
		{
			req.flash("fillProfile", "Veuillez completer votre profil avant de recevoir des suggestions");
		}
	})
})


module.exports = router






























