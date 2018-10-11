var express = require('express');
var eschtml = require('htmlspecialchars');
var hash = require('password-hash');

var router = express.Router();
var con = require('../config/database');

router.post("/", function(req, res) {
	var login = eschtml(req.body.login);
	var password = eschtml(req.body.password);

	var sql = "SELECT * FROM users WHERE login = ?";
	con.query(sql, [login], function(err, result) {
		if (result.length > 0) 
		{
			if (hash.verify(password, result[0].password) == true)
			{
				//initialiser variable de session pour le login
				req.log(login);
				var sql = "SELECT * FROM pics WHERE login = ?";
				con.query(sql, [req.session.log], function(err, result) {
					var pics = result;
					var sql = "SELECT * FROM users WHERE login = ?";
					con.query(sql, [req.session.log], function(err, result) {
						var users = result;
						var sql = "SELECT * FROM tags WHERE login = ?";
						con.query(sql, [req.session.log], function(err, result) {
							var tags = result;
							console.log(tags);
							res.render("index", {result: pics[0], info: users[0], tags: tags});
						})
					})
				})
			}
			else
			{
				req.flash("wrongPass", "Mot de passe incorrect");
				res.redirect("signIn");
			}
		}
		else
		{
			req.flash("noLogin", "Cet utilisateur n'existe pas");
			res.redirect("signIn");
		}
	})

})


module.exports = router