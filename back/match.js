var express = require('express');
var geopoint = require('geopoint');

var router = express.Router();
var con = require('../config/database');
var tools = require('./tools');


router.get("/", function(req, res) {
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

							tools.getPicsUsersJoin('Feminin', 'Héterosexuel', function(suggestions) {
								tools.getLikes(users[0].id, function(likes) {
									tools.getBlock(users[0].id, function (block) {
										tools.getReport(users[0].id, function (report) {
											res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report});
										})
									})

								})
							})
						}
						if (users[0].orientation == 'Homosexuel')
						{
							tools.getPicsUsersJoin('Masculin', 'Homosexuel', function(suggestions) {
								tools.getLikes(users[0].id, function(likes) {
									tools.getBlock(users[0].id, function (block) {
										tools.getReport(users[0].id, function (report) {
											res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report});
										})
									})

								})
							})
						}
						if (users[0].orientation == 'Bisexuel')
						{
							tools.getPicsUsersJoin(0, 'Bisexuel', function(suggestions) {
								tools.getLikes(users[0].id, function(likes) {
									tools.getBlock(users[0].id, function (block) {
										tools.getReport(users[0].id, function (report) {
											res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report});
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
							tools.getPicsUsersJoin('Masculin', 'Héterosexuel', function(suggestions) {
								tools.getLikes(users[0].id, function(likes) {
									tools.getBlock(users[0].id, function (block) {
										tools.getReport(users[0].id, function (report) {
											res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report});
										})
									})
								})
							})
						}
						if (users[0].orientation == 'Homosexuel')
						{
							tools.getPicsUsersJoin('Feminin', 'Homosexuel', function(suggestions) {
								tools.getLikes(users[0].id, function(likes) {
									tools.getBlock(users[0].id, function (block) {
										tools.getReport(users[0].id, function (report) {
											res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report});
										})
									})
								})
							})
						}
						if (users[0].orientation == 'Bisexuel')
						{
							tools.getPicsUsersJoin(0, 'Bisexuel', function(suggestions) {
								tools.getLikes(users[0].id, function(likes) {
									tools.getBlock(users[0].id, function (block) {
										tools.getReport(users[0].id, function (report) {
											res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report});
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
	console.log(sort);

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

							tools.getPicsUsersJoinFilter('Feminin', 'Héterosexuel', age[0], age[2], sort, function(suggestions) {
								tools.getLikes(users[0].id, function(likes) {
									tools.getBlock(users[0].id, function (block) {
										tools.getReport(users[0].id, function (report) {
											res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
										})
									})

								})
							})
						}
						if (users[0].orientation == 'Homosexuel')
						{
							tools.getPicsUsersJoinFilter('Masculin', 'Homosexuel', age[0], age[2], sort, function(suggestions) {
								tools.getLikes(users[0].id, function(likes) {
									tools.getBlock(users[0].id, function (block) {
										tools.getReport(users[0].id, function (report) {
											res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
										})
									})

								})
							})
						}
						if (users[0].orientation == 'Bisexuel')
						{
							tools.getPicsUsersJoinFilter(0, 'Bisexuel', age[0], age[2], sort,  function(suggestions) {
								tools.getLikes(users[0].id, function(likes) {
									tools.getBlock(users[0].id, function (block) {
										tools.getReport(users[0].id, function (report) {
											res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
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
							tools.getPicsUsersJoinFilter('Masculin', 'Héterosexuel', age[0], age[2], sort, function(suggestions) {
								tools.getLikes(users[0].id, function(likes) {
									tools.getBlock(users[0].id, function (block) {
										tools.getReport(users[0].id, function (report) {
											res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
										})
									})
								})
							})
						}
						if (users[0].orientation == 'Homosexuel')
						{
							tools.getPicsUsersJoinFilter('Feminin', 'Homosexuel', age[0], age[2], sort, function(suggestions) {
								tools.getLikes(users[0].id, function(likes) {
									tools.getBlock(users[0].id, function (block) {
										tools.getReport(users[0].id, function (report) {
											res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
										})
									})
								})
							})
						}
						if (users[0].orientation == 'Bisexuel')
						{
							tools.getPicsUsersJoinFilter(0, 'Bisexuel', age[0], age[2], sort, function(suggestions) {
								tools.getLikes(users[0].id, function(likes) {
									tools.getBlock(users[0].id, function (block) {
										tools.getReport(users[0].id, function (report) {
											res.render("match", {info: users[0], tags: tags, suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, ageValues: age, distanceValue: distance, popularite: popularite, sort: sort});
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






























