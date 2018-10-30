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
					res.render("index", {result: pics[0], info: users[0], tags: tags});
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





var usersSockets = [];
var connections = [];

io.on('connection', function (socket) {
	connections.push(socket);
	console.log('%s sockets connected', connections.length);

	socket.on('disconnect', function (data) {
		var sql = "UPDATE users SET connected = CURRENT_TIMESTAMP WHERE login = ?";
		con.query(sql, [socket.username]);
		usersSockets.splice(usersSockets.indexOf(socket.username), 1);
		connections.splice(connections.indexOf(socket), 1);
		console.log("1 socket disconnected, %s socket remaining: ", connections.length);
	})
	socket.on('new user', function(data) {
		socket.username = data;
		// if (usersSockets.indexOf(socket.username) !== -1)
			usersSockets.push(socket.username);
		console.log(usersSockets);
		socket.emit('connected users', usersSockets);
		app.set('usersSockets', usersSockets);
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
