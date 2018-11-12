var express = require('express');
var geopoint = require('geopoint');
var router = express.Router();
var con = require('../config/database');
var tools = require('./tools');
var moment = require('moment');
router.get("/", function(req, res) {
	if (req.session.log !== undefined)
	{
		var connectedUsers = req.app.get('usersSockets');
		if (req.session.log !== undefined)
		{
			tools.getUser(req.session.log, function(users) {
				tools.getTags(req.session.log, function(tags) {
					if (users[0].age !== 0 && users[0].sexe !== 'NULL' && users[0].orientation !== 'NULL' && users[0].bio !== 'NULL')
					{
						if (users[0].sexe == 'Masculin')
						{
							if (users[0].orientation == 'Héterosexuel')
								tools.render(tags, res, users, 'Feminin', 'Héterosexuel', connectedUsers, moment)
							if (users[0].orientation == 'Homosexuel')
								tools.render(tags, res, users, 'Masculin', 'Homosexuel', connectedUsers, moment)
							if (users[0].orientation == 'Bisexuel')
								tools.render(tags, res, users, 0, 'Bisexuel', connectedUsers, moment)
						}
						if (users[0].sexe == 'Feminin')
						{
							if (users[0].orientation == 'Héterosexuel')
								tools.render(tags, res, users, 'Masculin', 'Héterosexuel', connectedUsers, moment)
							if (users[0].orientation == 'Homosexuel')
								tools.render(tags, res, users, 'Feminin', 'Homosexuel', connectedUsers, moment)
							if (users[0].orientation == 'Bisexuel')
								tools.render(tags, res, users, 0, 'Bisexuel', connectedUsers, moment)
						}
					}
					else
					{
						res.render("match", {info: users[0], tags: tags, fillProfile: "Veuillez completer votre profil avant de recevoir des suggestions"});
					}
				})
			})
		}
	}
	else
	{
		res.redirect('/');
	}
})
router.post("/", function(req, res) {
	if (req.session.log !== undefined)
	{
		var connectedUsers = req.app.get('usersSockets');
		if (req.session.log !== undefined)
		{
			tools.getUser(req.session.log, function(users) {
				tools.getTags(req.session.log, function(tags) {
					if (users[0].age !== 0 && users[0].sexe !== 'NULL' && users[0].orientation !== 'NULL' && users[0].bio !== 'NULL')
					{
						if (users[0].sexe == 'Masculin')
						{
							if (users[0].orientation == 'Héterosexuel')
								tools.renderPost(req.body, tags, res, users, 'Feminin', 'Héterosexuel', connectedUsers, moment)
							if (users[0].orientation == 'Homosexuel')
								tools.renderPost(req.body, tags, res, users, 'Masculin', 'Homosexuel', connectedUsers, moment)
							if (users[0].orientation == 'Bisexuel')
								tools.renderPost(req.body, tags, res, users, 0, 'Bisexuel', connectedUsers, moment)
						}
						if (users[0].sexe == 'Feminin')
						{
							if (users[0].orientation == 'Héterosexuel')
								tools.renderPost(req.body, tags, res, users, 'Masculin', 'Héterosexuel', connectedUsers, moment)
							if (users[0].orientation == 'Homosexuel')
								tools.renderPost(req.body, tags, res, users, 'Feminin', 'Homosexuel', connectedUsers, moment)
							if (users[0].orientation == 'Bisexuel')
								tools.renderPost(req.body, tags, res, users, 0, 'Bisexuel', connectedUsers, moment)
						}
					}
					else
					{
						res.render("match", {info: users[0], tags: tags, fillProfile: "Veuillez completer votre profil avant de recevoir des suggestions"});
					}
				})
			})
		}
	}
	else
	{
		res.redirect('/');
	}
})
module.exports = router