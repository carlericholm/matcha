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
				console.log("On est dans le bon");
				req.log(login);
				res.redirect("index");
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