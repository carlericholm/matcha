var express = require('express');
var eschtml = require('htmlspecialchars');
var querystring = require('querystring');
var url = require("url");

var router = express.Router();
var con = require('../config/database');




router.post("/", function(req, res) {
	
	if (req.body.saveTag && req.body.tags !== '')
	{
		var tag = eschtml(req.body.tags);
		var noSpace = tag.split(' ').join('');
		if (tag !== '')
		{
			var block = 0;
			con.query("SELECT * FROM tags WHERE login = ?", [req.session.log], function(err, result) {
				for (var i = 0; i < result.length; i++)
				{
					if (result[i].tag == tag)
					{
						block = 1;
					}
				}
				if (block == 1)
				{
					req.flash("exists", "Tag existant");
				}
				else
				{				
					con.query("INSERT into tags SET login = ?, tag = ?", [req.session.log, noSpace]);
				}
				res.redirect('/');

			})

		}
	}
	else if (req.body.tagId) {
		var id = req.body.tagId;
		con.query("DELETE FROM tags WHERE id = ?", [id]);
	}
	else
	{
		res.redirect('/');
	}
})


module.exports = router






























