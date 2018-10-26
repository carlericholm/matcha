var express = require('express');
var geopoint = require('geopoint');

var router = express.Router();
var con = require('../config/database');
var tools = require('./tools');


router.get("/", function(req, res) {
	if (req.session.log !== undefined)
	{
		var age = [0, 0, 100];
		var distance = [0, 0, 10000]
		var popularite = [0, 0, 1000];
		var sort = 'age';
		tools.getUser(req.session.log, function(users) {
			tools.getTags(req.session.log, function(tags) {
				if (users[0].age !== 0 && users[0].sexe !== 'NULL' && users[0].orientation !== 'NULL' && users[0].bio !== 'NULL')
				{
					if (users[0].sexe == 'Masculin')
					{
						if (users[0].orientation == 'Héterosexuel')
						{

							tools.getPicsUsersJoin('Feminin', 'Héterosexuel', function(result) {
								tools.getSortedMatchingScoreList(users, users[0].latitude, users[0].longitude, result, function (suggestions) {
									tools.getLikes(users[0].id, function(likes) {
										tools.getBlock(users[0].id, function (block) {
											tools.getReport(users[0].id, function (report) {
												res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
											})
										})
									})
								})
							})
						}
						if (users[0].orientation == 'Homosexuel')
						{
							tools.getPicsUsersJoin('Masculin', 'Homosexuel', function(result) {
								tools.getSortedMatchingScoreList(users, users[0].latitude, users[0].longitude, result, function (suggestions) {
									tools.getLikes(users[0].id, function(likes) {
										tools.getBlock(users[0].id, function (block) {
											tools.getReport(users[0].id, function (report) {
												res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
											})
										})
									})
								})
							})
						}
						if (users[0].orientation == 'Bisexuel')
						{
							tools.getPicsUsersJoin(0, 'Bisexuel', function(result) {
								tools.getSortedMatchingScoreList(users, users[0].latitude, users[0].longitude, result, function (suggestions) {
									tools.getLikes(users[0].id, function(likes) {
										tools.getBlock(users[0].id, function (block) {
											tools.getReport(users[0].id, function (report) {
												res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
											})
										})
									})
								})
							})
						}
					}
					if (users[0].sexe == 'Feminin')
					{
						if (users[0].orientation == 'Héterosexuel')
						{
							tools.getPicsUsersJoin('Masculin', 'Héterosexuel', function(result) {
								tools.getSortedMatchingScoreList(users, users[0].latitude, users[0].longitude, result, function (suggestions) {
									tools.getLikes(users[0].id, function(likes) {
										tools.getBlock(users[0].id, function (block) {
											tools.getReport(users[0].id, function (report) {
												res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
											})
										})
									})
								})
							})
						}
						if (users[0].orientation == 'Homosexuel')
						{
							tools.getPicsUsersJoin('Feminin', 'Homosexuel', function(result) {
								tools.getSortedMatchingScoreList(users, users[0].latitude, users[0].longitude, result, function (suggestions) {
									tools.getLikes(users[0].id, function(likes) {
										tools.getBlock(users[0].id, function (block) {
											tools.getReport(users[0].id, function (report) {
												res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
											})
										})
									})
								})
							})
						}
						if (users[0].orientation == 'Bisexuel')
						{
							tools.getPicsUsersJoin(0, 'Bisexuel', function(result) {
								tools.getSortedMatchingScoreList(users, users[0].latitude, users[0].longitude, result, function (suggestions) {
									tools.getLikes(users[0].id, function(likes) {
										tools.getBlock(users[0].id, function (block) {
											tools.getReport(users[0].id, function (report) {
												res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
											})
										})
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
	var age = req.body.age.split(" ");
	var distance = req.body.distance.split(" ");
	var popularite = req.body.popularite.split(" ");
	var sort = req.body.sort;

	if (req.session.log !== undefined)
	{
		tools.getUser(req.session.log, function(users) {
			tools.getTags(req.session.log, function(tags) {
				if (users[0].age !== 0 && users[0].sexe !== 'NULL' && users[0].orientation !== 'NULL' && users[0].bio !== 'NULL')
				{
					if (users[0].sexe == 'Masculin')
					{
						if (users[0].orientation == 'Héterosexuel')
						{

							tools.getPicsUsersJoin('Feminin', 'Héterosexuel', function(result) {
								tools.getSortedMatchingScoreList(users, users[0].latitude, users[0].longitude, result, function (matchList) {
									tools.getFilteredResults(age[0], age[2], popularite[0], popularite[2], sort, matchList, function(suggestions) {
										tools.getLikes(users[0].id, function(likes) {
											tools.getBlock(users[0].id, function (block) {
												tools.getReport(users[0].id, function (report) {
													res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
												})
											})
										})
									})
								})
							})
						}
						if (users[0].orientation == 'Homosexuel')
						{
							tools.getPicsUsersJoin('Masculin', 'Homosexuel', function(result) {
								tools.getSortedMatchingScoreList(users, users[0].latitude, users[0].longitude, result, function (matchList) {
									tools.getFilteredResults(age[0], age[2], popularite[0], popularite[2], sort, matchList, function(suggestions) {
										tools.getLikes(users[0].id, function(likes) {
											tools.getBlock(users[0].id, function (block) {
												tools.getReport(users[0].id, function (report) {
													res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
												})
											})
										})
									})
								})
							})
						}
						if (users[0].orientation == 'Bisexuel')
						{
							tools.getPicsUsersJoin(0, 'Bisexuel', function(result) {
								tools.getSortedMatchingScoreList(users, users[0].latitude, users[0].longitude, result, function (matchList) {
									tools.getFilteredResults(age[0], age[2], popularite[0], popularite[2], sort, matchList, function(suggestions) {
										tools.getLikes(users[0].id, function(likes) {
											tools.getBlock(users[0].id, function (block) {
												tools.getReport(users[0].id, function (report) {
													res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
												})
											})
										})
									})
								})
							})
						}
					}
					if (users[0].sexe == 'Feminin')
					{
						if (users[0].orientation == 'Héterosexuel')
						{
							tools.getPicsUsersJoin('Masculin', 'Héterosexuel', function(result) {
								tools.getSortedMatchingScoreList(users, users[0].latitude, users[0].longitude, result, function (matchList) {
									tools.getFilteredResults(age[0], age[2], popularite[0], popularite[2], sort, matchList, function(suggestions) {
										tools.getLikes(users[0].id, function(likes) {
											tools.getBlock(users[0].id, function (block) {
												tools.getReport(users[0].id, function (report) {
													res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
												})
											})
										})
									})
								})
							})
						}
						if (users[0].orientation == 'Homosexuel')
						{
							tools.getPicsUsersJoin('Feminin', 'Homosexuel', function(result) {
								tools.getSortedMatchingScoreList(users, users[0].latitude, users[0].longitude, result, function (matchList) {
									tools.getFilteredResults(age[0], age[2], popularite[0], popularite[2], sort, matchList, function(suggestions) {
										tools.getLikes(users[0].id, function(likes) {
											tools.getBlock(users[0].id, function (block) {
												tools.getReport(users[0].id, function (report) {
													res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
												})
											})
										})
									})
								})
							})
						}
						if (users[0].orientation == 'Bisexuel')
						{
							tools.getPicsUsersJoin(0, 'Bisexuel', function(result) {
								tools.getSortedMatchingScoreList(users, users[0].latitude, users[0].longitude, result, function (matchList) {
									tools.getFilteredResults(age[0], age[2], popularite[0], popularite[2], sort, matchList, function(suggestions) {
										tools.getLikes(users[0].id, function(likes) {
											tools.getBlock(users[0].id, function (block) {
												tools.getReport(users[0].id, function (report) {
													res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
												})
											})
										})
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


module.exports = router






























