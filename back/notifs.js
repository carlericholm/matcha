var express = require('express');
var geopoint = require('geopoint');
var moment = require('moment');
var tools = require('./tools');
var router = express.Router();
var con = require('../config/database');


router.get("/", function(req, res) {
	var connectedUsers = req.app.get('usersSockets');
	var sql = "SELECT * FROM users WHERE login = ?";
	con.query(sql, [req.session.log], function (err, result) {
		var users = result;
		var sql = "SELECT * FROM likes WHERE liked_id = ?";
		con.query(sql, [users[0].id], function (err, result) {
			if (result.length > 0)
			{
				var likeList = result;
				var tabList = likeList.map(el => {return el.liker_id});
				var sql = "SELECT * FROM users WHERE id IN (?)";
				con.query(sql, [tabList], function(err, result) {
					var suggestions = result.reverse();
					var sql = "SELECT * FROM likes WHERE liker_id = ?";
					con.query(sql, [users[0].id], function(err, result) {
						var likes = result;
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
													var sql = "SELECT * from notifs WHERE receiver_id = ? AND seen = 0;";
													con.query(sql, [users[0].id], function(err, result) {
														var notifs = tools.getNotifsMessages(result).reverse();
														res.render("notifs", {info: users[0], suggestions: suggestions, geopoint: geopoint, likes: likes, block: block, report: report, pics: pics, visiters: visitersInfoDates, moment: moment, notif: notifs_messages, connectedUsers: connectedUsers, notifs: notifs});
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
				var sql = "SELECT * FROM visits WHERE visited_id = ? ORDER BY date DESC";
				con.query(sql, [users[0].id], function (err, result) {
					if (result.length > 0)
					{
						var visiterList = result;
						var visitList = visiterList.map(el => {return el.visiter_id});
						var sql = "SELECT * FROM users WHERE id IN (?)";
						con.query(sql, [visitList], function(err, result) {
							var visitersInfo = result;
							var sql = "SELECT * FROM likes WHERE liker_id = ?";
							con.query(sql, [users[0].id], function(err, result) {
								var likes = result;
								var sql = "SELECT * FROM block WHERE blocker_id = ?";
								con.query(sql, [users[0].id], function(err, result) {
									var block = result;
									var sql = "SELECT * FROM report WHERE reporter_id = ?";
									con.query(sql, [users[0].id], function(err, result) {
										var report = result;
										var picsLogin = visitersInfo.map(el => {return el.login});
										var sql = "SELECT * FROM pics WHERE login IN (?)";
										con.query(sql, [picsLogin], function (err, result) {
											var pics = result;
											var picsLoginVisits = visitersInfo.map(el => {return el.login});
											var sql = "SELECT users.*, visited_id, visiter_id, date, pics.* FROM users INNER JOIN visits on users.id = visits.visiter_id INNER JOIN pics on pics.login = users.login WHERE users.login IN (?) ORDER BY date DESC";
											con.query(sql, [picsLoginVisits], function (err, result) {
												var visitersInfoDates = result;
												var sql = "SELECT * from notifs_messages WHERE receiver_id = ?";
												con.query(sql, [users[0].id], function(err, result) {
													var notifs_messages = tools.getNotifsMessages(result);
													var sql = "SELECT * from notifs WHERE receiver_id = ?";
													con.query(sql, [users[0].id], function(err, result) {
														var notifs = tools.getNotifsMessages(result).reverse();
														res.render("notifs", {info: users[0], geopoint: geopoint, likes: likes, block: block, report: report, pics: pics, visiters: visitersInfoDates, moment: moment, notif: notifs_messages, connectedUsers: connectedUsers, notifs: notifs});
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
						res.render("notifs", {info: users[0]});
					}

				})
			}
		})
})
})



module.exports = router






























