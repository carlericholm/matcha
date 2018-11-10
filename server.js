var con = require('./config/database');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var helmet = require('helmet');
var nodemailer = require('nodemailer');
var path = require('path');
var fileUpload = require('express-fileupload');
const favicon = require('express-favicon');
var geopoint = require('geopoint');
var eschtml = require('htmlspecialchars');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(8080);

// Routes var

var register = require('./back/register');
var confirm = require('./back/confirm');
var signin = require('./back/signin');
var resetPass = require('./back/resetPass');
var signout = require('./back/signout');
var profil = require('./back/profil');
var tags = require('./back/tags');
var images = require('./back/images');
var match = require('./back/match');
var likes = require('./back/likes');
var block = require('./back/block');
var report = require('./back/report');
var notifs = require('./back/notifs');
var tools = require('./back/tools');
var tchat = require('./back/tchat');




//Moteur de template

// app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

//Middlewares

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(__dirname + '/public/favicon.png'));

app.use(session({
	secret: 'karlsecret',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));
app.use(helmet());
app.use(fileUpload());

app.use(require('./Middlewares/flash'))
app.use(require('./Middlewares/user'))


//routes

app.get('/', function(req, res) {
	if (req.session.log !== undefined)
	{
		var sql = "SELECT * FROM pics WHERE login = ?";
		con.query(sql, [req.session.log], function(err, result) {
			var pics = result;
			var sql = "SELECT * FROM users WHERE login = ?";
			con.query(sql, [req.session.log], function(err, result) {
				var users = result;
				var sql = "SELECT * FROM tags WHERE login = ?";
				con.query(sql, [req.session.log], function(err, result) {
					var tags = result;
					Object.keys(users[0]).map(function(key) {
						if (typeof users[0][key] === "string") {
							users[0][key] = tools.casseCouilles(users[0][key]);
						}
					});
					var sql = "SELECT * from notifs_messages WHERE receiver_id = ?";
					con.query(sql, [users[0].id], function(err, result) {
						var notifs_messages = tools.getNotifsMessages(result);
						var sql = "SELECT * from notifs WHERE receiver_id = ?";
						con.query(sql, [users[0].id], function(err, result) {
							var notifs = tools.getNotifsMessages(result).reverse();
							res.render("index", {result: pics[0], info: users[0], tags: tags, notif: notifs_messages, notifs: notifs});
						})
					})
				})
			})
		})
	}
	else
	{
		res.render('landingPage');
	}
});

app.get('/signup', function(req, res) {
	res.render('signup');
});

app.get('/signIn', function(req, res) {
	res.render('signIn');
});

app.get('/resetPass', function(req, res) {
	res.render('resetPass');
});


app.get('/index', function(req, res) {
	res.render('index');
});





var usersSockets = new Array();
var connections = [];

io.on('connection', function (socket) {
	connections.push(socket);
	console.log('%s sockets connected', connections.length);



	socket.on('new user', function(data) {
		socket.username = data;
		// if (usersSockets.indexOf(socket.username) == -1)
		usersSockets.push(socket.username);
		socket.emit('connected users', usersSockets);
		socket.broadcast.emit("connected users", usersSockets);
		app.set('usersSockets', usersSockets);
	})

	socket.on("new room", function (data) {
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [socket.username], function(err, result) {
			if (data > result[0].id)
				var room = "room" + data + '_' + result[0].id;
			else
				var room = "room" + result[0].id + '_' + data;
			socket.join(room);
		})	
	})



	socket.on('send message', function (message, receiver_id) {
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [socket.username], function(err, result) {
			var sql = "INSERT INTO notifs_messages SET sender_id = ?, receiver_id = ?";
			con.query(sql, [result[0].id, receiver_id]);
			var sql = "INSERT INTO chat SET message = ?, sender_id = ?, receiver_id = ?, date = CURRENT_TIMESTAMP";
			con.query(sql, [eschtml(message), result[0].id, receiver_id]);
			if (receiver_id > result[0].id)
			{
				socket.to('room' + receiver_id + '_' + result[0].id).emit("put message", {msg: message, id: result[0].id});
			}
			else
			{
				socket.to('room' + result[0].id + '_' + receiver_id).emit("put message", {msg: message, id: result[0].id});

			}
			var sql = "SELECT * FROM users WHERE id = ?";
			con.query(sql, [receiver_id], function(err, result) {
				var login = result[0].login;
				var sql = "SELECT * from notifs_messages WHERE receiver_id = ?";
				con.query(sql, [receiver_id], function(err, result) {
					if (result.length > 0)
					{
						var notif = tools.getNotifsMessages(result);
						var nb = 0;
						var temp = new Array();
						for (var n = 0; n < notif.length ; n++) 
							temp.push(notif[n].sender_id);
						var resultat = new Array();
						temp.forEach(function (element) {
							if (resultat.indexOf(element) == -1)
								resultat.push(element);
						})
						nb = resultat.length;
						if (nb > 0)
							socket.broadcast.emit("test", {login: login, nb: nb});
						else
							socket.broadcast.emit("test", {login: login, nb: 0});		
					}
					else
						socket.broadcast.emit("test", {login: login, nb: 0});
				})
			})
		})
	})


	socket.on("new notif", function (data) {
		console.log(data.type);
		console.log("space");
		console.log(data.receiver_id);
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [socket.username], function(err, result) {
			var sql = "INSERT INTO notifs SET notif = ?, sender_id = ?, receiver_id = ?";
			con.query(sql, [data.type, result[0].id, data.receiver_id]);
		})
	})









	socket.on("remove notif message", function(sender_id) {
		var sql = "SELECT * FROM users WHERE login = ?";
		con.query(sql, [socket.username], function(err, result) {
			var sql = "DELETE FROM notifs_messages WHERE sender_id = ? AND receiver_id = ?";
			con.query(sql, [sender_id, result[0].id]);
		})
	})


	socket.on('disconnect', function (data) {
		socket.broadcast.emit("disconnected user", socket.username);
		var sql = "UPDATE users SET connected = CURRENT_TIMESTAMP WHERE login = ?";
		con.query(sql, [socket.username]);
		usersSockets.splice(usersSockets.indexOf(socket.username), 1);
		connections.splice(connections.indexOf(socket), 1);
		console.log("1 socket disconnected, %s socket remaining: ", connections.length);
	})
});



app.use('/register', register);
app.use('/confirm', confirm);
app.use('/resetPass', resetPass);
app.use('/signin', signin);
app.use('/signout', signout);
app.use('/profil', profil);
app.use('/tags', tags);
app.use('/images', images);
app.use('/match', match);
app.use('/likes', likes);
app.use('/block', block);
app.use('/report', report);
app.use('/notifs', notifs);
app.use('/tchat', tchat);




// app.listen(8080);
