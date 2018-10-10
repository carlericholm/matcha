var express = require('express');
var fileUpload = require('express-fileupload');
var validator = require('validator');
var eschtml = require('htmlspecialchars');

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
		// var password = eschtml(req.body.password);
		var regUp = /[A-Z]+/;
		var regLow = /[a-z]+/;
		var regNumber = /[0-9]+/;
		var regMail = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/;

		var sql = "SELECT email FROM users WHERE login = ?";
		con.query(sql, [req.session.log], function(err, result) {
			console.log(result[0].email);
			if (req.body.email !== result[0].email)
			{
				if (email.search(regMail) !== -1)
				{
					var sql = "SELECT email FROM users WHERE email = ?";
					con.query(sql, [req.body.email], function(err, result) {
						if (result.length > 0)
						{
							req.flash("mailUsed", "Désolé, cette adresse email est déja prise par un autre utilisateur");
							console.log("mail deja utilise")
							res.redirect('/');
						}
					})
				}
				else
				{
					console.log("mail invalide")
					req.flash("mail", "Veuillez entrer une adresse mail valide");
					res.redirect('/');
				}
			}
			else
			{
				res.redirect('/');
			}
		})
	}
})
// })


module.exports = router






























