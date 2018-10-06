var express = require('express');
var eschtml = require('htmlspecialchars');
var hash = require('password-hash');
var nodemailer = require('nodemailer');
var md5 = require('md5');
var microtime = require('microtime');

var router = express.Router();
var con = require('../config/database');

router.post('/', function(req, res) {
	if (req.body.firstname && req.body.name && req.body.email && req.body.login && req.body.password && req.body.passConfirm)
	{
		var login = eschtml(req.body.login);
		var name = eschtml(req.body.name);
		var firstname = eschtml(req.body.firstname);
		var email = eschtml(req.body.email);
		var password = eschtml(req.body.password);
		var regUp = /[A-Z]+/;
		var regLow = /[a-z]+/;
		var regNumber = /[0-9]+/;
		var regMail = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/;
		if (req.body.password == req.body.passConfirm)
		{
			if (password.search(regUp) !== -1 && password.search(regLow) !== -1 && password.search(regNumber) !== -1 && password.length > 5)
			{
				if (email.search(regMail) !== -1)
				{
					var sql = "SELECT email FROM users WHERE email = ?";
					con.query(sql, [email], function(err, result) {
						if (result.length > 0)
						{
							req.flash("mailUsed", "Désolé, cette adresse email est déja prise par un autre utilisateur");
							res.redirect('/signup');
						}
						else
						{
							var sql = "SELECT login FROM users WHERE login = ?";
							con.query(sql, [login], function (err, result) {
								if (result.length > 0)
								{
									req.flash("loginUsed", "Nom d'utilisateur déja pris");
									res.redirect('/signup');
								}
								else
								{
									var transporter = nodemailer.createTransport('smtps://matchazerty%40gmail.com:matchAZERTY@smtp.gmail.com');
									var key = md5(microtime.now());
                                    var mail =
                                        {
                                            from: "matcha@gmail.com", to: email, subject: "Confirmation de votre compte",
                                            html: '<html><body><div align=center> \
                                            CLICK ON THE FOLLOWING LINK TO VALIDATE YOUR MATCHA ACCOUNT: <BR />\
                                            <a href=http://localhost:8080/confirm?login='+login +'&key='+key +'>Confirm your Account</a> \
                                            </div></body></html>'
                                        }
                                         transporter.sendMail(mail, function(error, response){ if (error) { throw error }});

									con.query('INSERT INTO users SET login = ?, name = ?, firstname = ?, email = ?, password = ?, cle = ?', [login, name, firstname, email, hash.generate(password), key]);
									req.flash("success", "Merci pour votre inscription, rendez vous sur votre boite mail afin d'activer votre compte");
									res.redirect('/signup');
								}
							})
						}
					})
					// res.redirect('/signup');
				}
				else
				{
					req.flash("mail", "Veuillez entrer une adresse mail valide");
					res.redirect('/signup');
				}
			}
			else
			{
				req.flash("passRequire", "Votre mot de passe doit contenir au moins une minuscule, une majuscule, un nombre, et contenir minimum 5 caractères");
				res.redirect('/signup');
			}
		}
		else
		{
			req.flash("passDiff", "Les mots de passes ne sont pas identiques");
			res.redirect('/signup');
		}
	}
	else
	{
		req.flash('fill', "Veuillez remplir les champs manquants");
		res.redirect('/signup');
	}
	// else
	// {
	// 	con.query('INSERT INTO users SET login = ?, name = ?, firstname = ?, email = ?, password = ?', [login, name, firstname, email, hash.generate(password)]);
	// 	res.redirect('/');
	// }
})

module.exports = router