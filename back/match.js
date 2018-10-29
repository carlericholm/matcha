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
							tools.render(tags, res, users, 'Feminin', 'Héterosexuel')
						if (users[0].orientation == 'Homosexuel')
							tools.render(tags, res, users, 'Masculin', 'Homosexuel')
						if (users[0].orientation == 'Bisexuel')
							tools.render(tags, res, users, 0, 'Bisexuel')
					}
					if (users[0].sexe == 'Feminin')
					{
						if (users[0].orientation == 'Héterosexuel')
							tools.render(tags, res, users, 'Masculin', 'Héterosexuel')
						if (users[0].orientation == 'Homosexuel')
							tools.render(tags, res, users, 'Feminin', 'Homosexuel')
						if (users[0].orientation == 'Bisexuel')
							tools.render(tags, res, users, 0, 'Bisexuel')
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
	if (req.session.log !== undefined)
	{
		console.log(req.body)
		tools.getUser(req.session.log, function(users) {
			tools.getTags(req.session.log, function(tags) {
				if (users[0].age !== 0 && users[0].sexe !== 'NULL' && users[0].orientation !== 'NULL' && users[0].bio !== 'NULL')
				{
					if (users[0].sexe == 'Masculin')
					{
						if (users[0].orientation == 'Héterosexuel')
							tools.renderPost(req.body, tags, res, users, 'Feminin', 'Héterosexuel')
						if (users[0].orientation == 'Homosexuel')
							tools.renderPost(req.body, tags, res, users, 'Masculin', 'Homosexuel')
						if (users[0].orientation == 'Bisexuel')
							tools.renderPost(req.body, tags, res, users, 0, 'Bisexuel')
					}
					if (users[0].sexe == 'Feminin')
					{
						if (users[0].orientation == 'Héterosexuel')
							tools.renderPost(req.body, tags, res, users, 'Masculin', 'Héterosexuel')
						if (users[0].orientation == 'Homosexuel')
							tools.renderPost(req.body, tags, res, users, 'Feminin', 'Homosexuel')
						if (users[0].orientation == 'Bisexuel')
							tools.renderPost(req.body, tags, res, users, 0, 'Bisexuel')
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