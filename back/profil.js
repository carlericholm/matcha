var express = require('express');
var fileUpload = require('express-fileupload');
var validator = require('validator');
var eschtml = require('htmlspecialchars');
var hash = require('password-hash');

var router = express.Router();
var con = require('../config/database');


router.get("/", function(req, res) {
	if (req.session.log !== undefined)
	{
		var sql = "SELECT * FROM pics WHERE login = ?";
		con.query(sql, [req.session.log], function(err, result) { redirect('');})
	}
	else
	{
		res.render('landingPage');
	}
})

router.post("/", function(req, res) {
	if (req.body.save)
	{
		var name = eschtml(req.body.name);
		var firstname = eschtml(req.body.firstname);
		var email = eschtml(req.body.email);
		var bio = eschtml(req.body.bio);
		var password = eschtml(req.body.password);
		var regUp = /[A-Z]+/;
		var regLow = /[a-z]+/;
		var regNumber = /[0-9]+/;
		var regMail = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/;

		var sql = "SELECT email FROM users WHERE login = ?";
		con.query(sql, [req.session.log], function(err, result) {
			if (req.body.email !== result[0].email)
			{
				if (email.search(regMail) !== -1)
				{
					var sql = "SELECT email FROM users WHERE email = ?";
					con.query(sql, [req.body.email], function(err, result) {
						if (result.length > 0)
						{
							req.flash("mailUsed", "Désolé, cette adresse email est déja prise par un autre utilisateur");
						}
						else if (email.length > 100)
						{
							req.flash("mailUsed", "Désolé, cette adresse email est trop longue");
						}
						else
						{
							con.query('UPDATE users SET email = ? WHERE login = ? ', [email, req.session.log]);
						}
					})
				}
				else
				{
					req.flash("mail", "Veuillez entrer une adresse mail valide");
				}
			}
			if (req.body.password !== '' || (req.body.password == '' && req.body.passwordConfirm !== ''))
			{
				if (req.body.password == req.body.passwordConfirm && req.body.password.length < 30 && req.body.passwordConfirm.length < 30)
				{
					if (password.search(regUp) !== -1 && password.search(regLow) !== -1 && password.search(regNumber) !== -1 && password.length > 5)
					{
						con.query('UPDATE users set password = ? WHERE login = ?', [hash.generate(password), req.session.log]);
						var verif = 1;
					}
					else
					{
						req.flash("passRequire", "Votre mot de passe doit contenir au moins une minuscule, une majuscule, un nombre, et contenir minimum 5 caractères");
					}
				}
				else
				{
					req.flash("passDiff", "Les mots de passes ne sont pas identiques ou trop long");

				}
			}
			if ((req.body.password == '' && req.body.passwordConfirm == '') || verif == 1)
			{
				if (req.body.firstname && req.body.firstname.length < 30)
				{
					if (req.body.name && req.body.name.length < 30)
					{

						if (parseInt(req.body.age) == req.body.age && (req.body.age > 0 && req.body.age < 125))
						{
							if (bio.length < 500)
							{
								var sql = "UPDATE users SET name = ?, firstname = ?, age = ?, sexe = ?, orientation = ?, bio = ? WHERE login = ?";
								con.query(sql, [name, firstname, req.body.age, req.body.sexe, req.body.orientation, bio, req.session.log]);
								req.flash("success", "Vos informations ont été mises à jour");
							}
							else
							{
								req.flash("bioProblem", "Bio trop grande");
							}
						}
						else
						{
							req.flash("ageProblem", "Veuillez indiquer un age correct");
						}
					}
					else
					{
						req.flash("emptyName", "Veuillez entrez un nom correct");
					}
				}
				else
				{
					req.flash("emptyFirstname", "Veuillez entrer un prenom correct");
				}
			}

			res.redirect('/');
		})
	}
	if (req.body.tableau)
	{
		var localisation = JSON.parse(req.body.tableau);
		con.query("UPDATE users SET trueLocation = ?, latitude = ?, longitude = ? WHERE login = ?", [localisation.city, localisation.latitude, localisation.longitude, req.session.log]);
		res.redirect('/');
	}
	if (req.body.fakeLocation)
	{
		if (req.body.localisation.length < 30)
		{
			con.query("UPDATE users SET fakeLocation = ?, showFakeLocation = ? WHERE login = ?", [req.body.localisation, 1, req.session.log]);
			res.redirect('/');
		}
		else
		{
			req.flash("locTooLong", "Lol, bien essayé");
			res.redirect('/');
		}
	}
	if (req.body.trueLocation)
	{
		con.query("UPDATE users SET showFakeLocation = ? WHERE login = ?", [0, req.session.log]);
		res.redirect('/');
	}
})


module.exports = router
