var express = require('express');
var fileUpload = require('express-fileupload');

var router = express.Router();
var con = require('../config/database');


router.post("/", function(req, res) {
	var sql = "SELECT * FROM pics WHERE login = ?";
	con.query(sql, [req.session.log], function(err, result) {
		console.log(req.body.hidden);
		var id = req.body.hidden;
		var str = req.session.log + id;
		if (req.files.file_profil.mimetype == 'image/png')
		{
			var png = ".png";
			var result = str + png;
			con.query('UPDATE pics SET img'+id+' = ? WHERE login = ? ', [result, req.session.log]);
			req.files.file_profil.mv('/Users/cholm/projects/matcha/public/img/users/'+result, function(err) {if (err) return res.status(500).send(err); console.log("file fileUploaded");
				res.render("index", {pic: result});
			});

		}
		else if (req.files.file_profil.mimetype == 'image/jpg')
		{
			var jpg = ".jpg";
			var result = str + jpg;
			req.files.file_profil.mv('/Users/cholm/projects/matcha/public/img/users/'+result, function(err) {if (err) return res.status(500).send(err); console.log("file fileUploaded");
				res.render("index", {pic: result});
			});	
		}
		console.log(req.body);
		console.log(req.files.file_profil.mimetype);


	})

	// req.files.file_profil.mv('/Users/cholm/projects/matcha/public/img/users/test.jpg', function(err) {
 //    if (err)
 //      return res.status(500).send(err);
 
 //  	console.log("file fileUploaded");
 //  	res.render("index", {pic: req.body.file_profil});
 //  });
	// res.render("index", {pic: req.body.file_profil});
})


module.exports = router