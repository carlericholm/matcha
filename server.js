var con = require('./config/database');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var helmet = require('helmet');
var nodemailer = require('nodemailer');
var path = require('path');

var app = express();


// Routes var 

var register = require('./back/register');
var confirm = require('./back/confirm');
var signin = require('./back/signin');
var resetPass = require('./back/resetPass');
var signout = require('./back/signout');
var profil = require('./back/profil');


//Moteur de template

// app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

//Middlewares

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'karlsecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(helmet());

app.use(require('./Middlewares/flash'))
app.use(require('./Middlewares/user'))


//routes

app.get('/', function(req, res) {
	console.log(req.session);
	if (req.session.log !== undefined)
	{
		res.render('index');
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


app.use('/register', register);
app.use('/confirm', confirm);
app.use('/resetPass', resetPass);
app.use('/signin', signin);
app.use('/signout', signout);
app.use('/profil', profil);









app.listen(8080);
