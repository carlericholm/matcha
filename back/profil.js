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
		con.query(sql, [req.session.log], function(err, result) { res.render("index", {result: result[0]});})
	}
	else
	{
		res.render('landingPage');
	}
})

router.post("/", function(req, res) {
	if (req.body.envoyer)
	{
	// var sql = "SELECT * FROM pics WHERE login = ?";
	// con.query(sql, [req.session.log], function(err, result) {
		var id = req.body.hidden;
		var str = req.session.log + id;
		if (!req.files)
		{
			console.log("okokoko");
			console.log(req.files);
			res.render("index");
		}
		else if (req.files && req.files.file_profil.mimetype == 'image/png')
		{
			var png = ".png";
			var result = str + png;
			con.query('UPDATE pics SET img'+id+' = ? WHERE login = ? ', [result, req.session.log]);
			req.files.file_profil.mv('/Users/cholm/projects/matcha/public/img/users/'+result, function(err) {if (err) return res.status(500).send(err); console.log("file fileUploaded");
				var sql = "SELECT * FROM pics WHERE login = ?";
				con.query(sql, [req.session.log], function(err, result) {
					var pics = result;
					var sql = "SELECT * FROM users WHERE login = ?";
					con.query(sql, [req.session.log], function(err, result) {
						console.log(result);
						res.render("index", {result: pics[0], info: result[0]});
					})
				})
			});

		}
		else if (req.files && req.files.file_profil.mimetype == 'image/jpg')
		{
			var jpg = ".jpg";
			var result = str + jpg;
			con.query('UPDATE pics SET img'+id+' = ? WHERE login = ? ', [result, req.session.log]);
			req.files.file_profil.mv('/Users/cholm/projects/matcha/public/img/users/'+result, function(err) {if (err) return res.status(500).send(err); console.log("file fileUploaded");
				var sql = "SELECT * FROM pics WHERE login = ?";
				con.query(sql, [req.session.log], function(err, result) {
					var pics = result;
					var sql = "SELECT * FROM users WHERE login = ?";
					con.query(sql, [req.session.log], function(err, result) {
						console.log(result);
						res.render("index", {result: pics[0], info: result[0]});
					})
				})
			});	
		}
		else if (req.files && req.files.file_profil.mimetype == 'image/jpeg')
		{
			var jpg = ".jpeg";
			var result = str + jpg;
			con.query('UPDATE pics SET img'+id+' = ? WHERE login = ? ', [result, req.session.log]);
			req.files.file_profil.mv('/Users/cholm/projects/matcha/public/img/users/'+result, function(err) {if (err) return res.status(500).send(err); console.log("file fileUploaded");
				var sql = "SELECT * FROM pics WHERE login = ?";
				con.query(sql, [req.session.log], function(err, result) {
					var pics = result;
					var sql = "SELECT * FROM users WHERE login = ?";
					con.query(sql, [req.session.log], function(err, result) {
						console.log(result);
						res.render("index", {result: pics[0], info: result[0]});
					})
				})
			});	
		}
		// else
		// {
		// 	res.render("index");
		// }
	}
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
							// res.redirect('/');
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
					// res.redirect('/');
				}
			}
			if (req.body.password !== '')
			{
				console.log(req.body.password)
				if (req.body.password == req.body.passwordConfirm)
				{
					if (password.search(regUp) !== -1 && password.search(regLow) !== -1 && password.search(regNumber) !== -1 && password.length > 5)
					{
						con.query('UPDATE users set password = ? WHERE login = ?', [hash.generate(password), req.session.log]);
					}
					else
					{
						req.flash("passRequire", "Votre mot de passe doit contenir au moins une minuscule, une majuscule, un nombre, et contenir minimum 5 caractères");
					}
				}
				else
				{
					req.flash("passDiff", "Les mots de passes ne sont pas identiques");
				}
			}
			if (req.body.firstname)
			{
				if (req.body.name)
				{
					var sql = "UPDATE users SET name = ?, firstname = ?, age = ?, sexe = ?, orientation = ?, bio = ? WHERE login = ?";
					con.query(sql, [name, firstname, req.body.age, req.body.sexe, req.body.orientation, bio, req.session.log]);
					req.flash("success", "Vos informations ont été mises à jour");
				}
				else
				{
					req.flash("emptyName", "Veuillez ne pas laisser ce champ vide");
					console.log("champ vide");
				}
			}
			else
			{
				req.flash("emptyFirstname", "Veuillez ne pas laisser ce champ vide");
				console.log("champ vide");
			}
			res.redirect('/');
		})
	}
})
// })


module.exports = router






























