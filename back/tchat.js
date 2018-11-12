var express = require('express');
var geopoint = require('geopoint');
var moment = require('moment');
var tools = require('./tools');

var router = express.Router();
var con = require('../config/database');


function getMatchs(liked_tab, liker_tab)
{
	var result = new Array();
	liked_tab.forEach(function(liked_row) {
		liker_tab.forEach(function(liker_row) {
			if (liked_row.liker_id == liker_row.liked_id)
			{
				result.push(liker_row.liked_id);
			}
		})
	})
	return (result);
}

function getMessages(result)
{
	var tab = new Array();
	result.forEach(function(message) {
		tab.push(message)
	})
	return (tab);
}


router.get("/", function(req, res) {
	if (req.session.log !== undefined)
	{
		var connectedUsers = req.app.get('usersSockets');
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [req.session.log], function (err, result) {
			var users = result;
			var sql = "SELECT * FROM likes WHERE liked_id = ?";
			con.query(sql, [users[0].id], function (err, result) {
				if (result.length > 0)
				{
					var likeList = result;
					var sql = "SELECT * FROM likes WHERE liker_id = ?";
					con.query(sql, [users[0].id], function(err, result) {
						var matchs = getMatchs(likeList, result);
						if (matchs.length > 0)
						{
							var likes = result;
							var sql = "SELECT * FROM users WHERE id IN (?)";
							con.query(sql, [matchs], function(err, result) {
								var suggestions = result;
								var sql = "SELECT * FROM chat WHERE receiver_id IN (?) OR receiver_id = ?";
								con.query(sql, [matchs, users[0].id], function(err, result) {
									var messages = new Array();
									messages = getMessages(result);
									var sql = "SELECT * FROM block WHERE blocker_id = ?";
									con.query(sql, [users[0].id], function(err, result) {
										var block = result;
										var sql = "SELECT * FROM report WHERE reporter_id = ?";
										con.query(sql, [users[0].id], function(err, result) {
											var report = result;
											var picsLogin = suggestions.map(el => {return el.login});
											var sql = "SELECT * FROM pics WHERE login IN (?)";
											con.query(sql, [picsLogin], function (err, result) {
												var pics = result;
												var sql = "SELECT * FROM visits WHERE visited_id = ? ORDER BY date DESC";
												con.query(sql, [users[0].id], function (err, result) {
													var visiterList = result;
													var visitList = visiterList.map(el => {return el.visiter_id});
													var sql = "SELECT * FROM users WHERE id IN (?)";
													con.query(sql, [visitList], function(err, result) {
														var visitersInfo = result;
														var picsLoginVisits = visitersInfo.map(el => {return el.login});
														var sql = "SELECT users.*, visited_id, visiter_id, date, pics.* FROM users INNER JOIN visits on users.id = visits.visiter_id INNER JOIN pics on pics.login = users.login WHERE users.login IN (?) ORDER BY date DESC";
														con.query(sql, [picsLoginVisits], function (err, result) {
															var visitersInfoDates = result;
															var sql = "SELECT * from notifs_messages WHERE receiver_id = ?";
															con.query(sql, [users[0].id], function(err, result) {
																var notifs_messages = tools.getNotifsMessages(result);
																var sql = "SELECT * from notifs WHERE receiver_id = ? AND seen = 0";
																con.query(sql, [users[0].id], function(err, result) {
																	var notifs = tools.getNotifsMessages(result).reverse();
																	res.render("tchat", {info: users[0], suggestions: suggestions, geopoint: geopoint, likes: likes, messages: messages, block: block, report: report, pics: pics, visiters: visitersInfoDates, moment: moment, notif: notifs_messages, connectedUsers: connectedUsers, notifs: notifs});
																})
															})	
														})
													})
												})
											})
										})
									})
								})
							})
						}
						else
						{
							res.render("tchat");
						}
					})
				}
				else
				{
					res.render("tchat");
				}
			})
		})
	}
	else
	{
		res.redirect('/');
	}
})



module.exports = router


















