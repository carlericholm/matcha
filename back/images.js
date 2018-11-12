var express = require('express');
var fileUpload = require('express-fileupload');
var validator = require('validator');
var eschtml = require('htmlspecialchars');

var JSONStream = require('JSONStream');
var fs = require('fs');

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
	if (req.body.envoyer)
	{
		var id = req.body.hidden;
		var str = req.session.log + id;

		if (!req.files.file_profil)
		{
			console.log(req.files);
			res.redirect('/');
		}
		else if (req.files.file_profil.data.length > 3)
		{
			req.flash("imageTooBig", "Le fichier uploader est trop gros");
			res.redirect('/');
		}
		else if (req.files && req.files.file_profil.mimetype === 'image/png')
		{
			var png = ".png";
			var result = str + png;
			con.query('UPDATE pics SET img'+id+' = ? WHERE login = ? ', [result, req.session.log]);
			req.files.file_profil.mv(__dirname+'/../public/img/users/'+result, function(err) {if (err) return res.status(500).send(err); console.log("file fileUploaded");
				var sql = "SELECT * FROM pics WHERE login = ?";
				con.query(sql, [req.session.log], function(err, result) {
					var pics = result;
					var sql = "SELECT * FROM users WHERE login = ?";
					con.query(sql, [req.session.log], function(err, result) {
						console.log(result);
						res.redirect('/');
					})
				})
			});

		}
		else if (req.files && req.files.file_profil.mimetype === 'image/jpg')
		{
			var jpg = ".jpg";
			var result = str + jpg;
			con.query('UPDATE pics SET img'+id+' = ? WHERE login = ? ', [result, req.session.log]);
			req.files.file_profil.mv(__dirname+'/../public/img/users/'+result, function(err) {if (err) return res.status(500).send(err); console.log("file fileUploaded");
				var sql = "SELECT * FROM pics WHERE login = ?";
				con.query(sql, [req.session.log], function(err, result) {
					var pics = result;
					var sql = "SELECT * FROM users WHERE login = ?";
					con.query(sql, [req.session.log], function(err, result) {
						console.log(result);
						res.redirect('/');
					})
				})
			});	
		}
		else if (req.files && req.files.file_profil.mimetype === 'image/jpeg')
		{
			var jpg = ".jpeg";
			var result = str + jpg;
			con.query('UPDATE pics SET img'+id+' = ? WHERE login = ? ', [result, req.session.log]);
			req.files.file_profil.mv(__dirname+'/../public/img/users/'+result, function(err) {if (err) return res.status(500).send(err); console.log("file fileUploaded");
				var sql = "SELECT * FROM pics WHERE login = ?";
				con.query(sql, [req.session.log], function(err, result) {
					var pics = result;
					var sql = "SELECT * FROM users WHERE login = ?";
					con.query(sql, [req.session.log], function(err, result) {
						console.log(result);
						res.redirect('/');
					})
				})
			});	
		}
		
	}
})


module.exports = router






























