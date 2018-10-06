var express = require('express');
var querystring = require('querystring');
var url = require("url");
var router = express.Router();

var con = require('../config/database');


router.get('/', function(req, res) {
	var params = querystring.parse(url.parse(req.url).query);
	console.log(params.login + " / " + params.key);
	var login = params.login;
	var key = params.key;

	var sql = "SELECT * FROM users WHERE login = ?";
	con.query(sql, [login], function(err, result) {
		if (result.length > 0)
		{
			if (result[0].active == 0)
			{
				if (key == result[0].cle)
				{
					res.render('confirm', {success: "Votre compte à été activé !"});
					var sql = "UPDATE users set active = 1 WHERE login = ?";
					con.query(sql, [login], function(err, result) { if (err) { throw err };})
				}
				else if (key !== result[0].cle)
				{
					res.render('confirm', {error: "Clé d'identification invalide"});
				}
				else
				{
					res.render('confirm', {error: "Vous avez déja activé votre compte"});
				}
			}
			else
			{
				res.render('confirm', {success: "Votre compte à déja été activé !"});
			}
		}
		else
		{
			res.render('confirm', {error: "Une erreur innatendue s'est produite"});
		}
	})
});


module.exports = router