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

  var sql = "CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY AUTO_INCREMENT, login VARCHAR(255), name VARCHAR(255), firstname VARCHAR(255), email VARCHAR(255), password VARCHAR(255), cle VARCHAR(255), active INT DEFAULT 0, age INT(3) DEFAULT 0, sexe VARCHAR(255), orientation VARCHAR(255), bio TEXT)";                             
  con.query(sql, function (err, result) { if (err) throw err; console.log("Table users created"); });
  var sql = "CREATE TABLE IF NOT EXISTS pics (id INT PRIMARY KEY AUTO_INCREMENT, login VARCHAR(255), img0 VARCHAR(255) DEFAULT 'empty', img1 VARCHAR(255) DEFAULT 'empty', img2 VARCHAR(255) DEFAULT 'empty', img3 VARCHAR(255) DEFAULT 'empty', img4 VARCHAR(255) DEFAULT 'empty')";
  con.query(sql, function (err, result) { if (err) throw err; console.log("Table pics created"); });
});

module.exports = con;