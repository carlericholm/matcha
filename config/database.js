var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root42"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE IF NOT EXISTS matcha", function (err, result) { if (err) throw err; });
  con.query('USE `matcha`', function (err) { if (err) throw err });
  con.query('SET NAMES utf8mb4', function (err) { if (err) throw err })

  var sql = "CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY AUTO_INCREMENT, login VARCHAR(255), name VARCHAR(255), firstname VARCHAR(255), email VARCHAR(255), password VARCHAR(255), cle VARCHAR(255), active INT DEFAULT 0, age INT(3) DEFAULT 0, sexe VARCHAR(255), orientation VARCHAR(255), bio TEXT, trueLocation VARCHAR(255), fakeLocation VARCHAR(255), showFakeLocation INT DEFAULT 0, latitude DOUBLE, longitude DOUBLE, popularite INT(6) DEFAULT 0, connected DATETIME DEFAULT CURRENT_TIMESTAMP)";
  con.query(sql, function (err, result) { if (err) throw err; console.log("Table users created"); });
  var sql = "CREATE TABLE IF NOT EXISTS pics (id INT PRIMARY KEY AUTO_INCREMENT, login VARCHAR(255), img0 VARCHAR(255) DEFAULT 'empty', img1 VARCHAR(255) DEFAULT 'empty', img2 VARCHAR(255) DEFAULT 'empty', img3 VARCHAR(255) DEFAULT 'empty', img4 VARCHAR(255) DEFAULT 'empty')";
  con.query(sql, function (err, result) { if (err) throw err; console.log("Table pics created"); });
  var sql = "CREATE TABLE IF NOT EXISTS tags (id INT PRIMARY KEY AUTO_INCREMENT, login VARCHAR(255), tag VARCHAR(255))";
  con.query(sql, function (err, result) { if (err) throw err; console.log("Table tags created"); });
  var sql = "CREATE TABLE IF NOT EXISTS likes (id INT PRIMARY KEY AUTO_INCREMENT, liked_id INT(6) UNSIGNED NOT NULL, liker_id INT(6) UNSIGNED NOT NULL)";
  con.query(sql, function (err, result) { if (err) throw err; console.log("Table likes created"); });
  var sql = "CREATE TABLE IF NOT EXISTS block (id INT PRIMARY KEY AUTO_INCREMENT, blocked_id INT(6) UNSIGNED NOT NULL, blocker_id INT(6) UNSIGNED NOT NULL)";
  con.query(sql, function (err, result) { if (err) throw err; console.log("Table block created"); });
  var sql = "CREATE TABLE IF NOT EXISTS visits (id INT PRIMARY KEY AUTO_INCREMENT, visited_id INT(6) UNSIGNED NOT NULL, visiter_id INT(6) UNSIGNED NOT NULL, date DATETIME DEFAULT CURRENT_TIMESTAMP)";
  con.query(sql, function (err, result) { if (err) throw err; console.log("Table visited created"); });
  var sql = "CREATE TABLE IF NOT EXISTS report (id INT PRIMARY KEY AUTO_INCREMENT, reported_id INT(6) UNSIGNED NOT NULL, reporter_id INT(6) UNSIGNED NOT NULL, date DATETIME DEFAULT CURRENT_TIMESTAMP)";
  con.query(sql, function (err, result) { if (err) throw err; console.log("Table report created"); });
  var sql = "CREATE TABLE IF NOT EXISTS chat (id INT PRIMARY KEY AUTO_INCREMENT, message TEXT, sender_id INT(6), receiver_id INT(6), date DATETIME DEFAULT CURRENT_TIMESTAMP)";
  con.query(sql, function (err, result) { if (err) throw err; console.log("Table message created"); });
  var sql = "CREATE TABLE IF NOT EXISTS notifs (id INT PRIMARY KEY AUTO_INCREMENT, notif TEXT, sender_id INT(6), receiver_id INT(6))";
  con.query(sql, function (err, result) { if (err) throw err; console.log("Table message notifs created"); });
  var sql = "CREATE TABLE IF NOT EXISTS notifs_messages (id INT PRIMARY KEY AUTO_INCREMENT, sender_id INT(6), receiver_id INT(6))";
  con.query(sql, function (err, result) { if (err) throw err; console.log("Table message notifs_messages created"); });
  var seed = require('../back/generateProfiles');
});

module.exports = con;
