var con = require('./config/database');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var helmet = require('helmet');

var app = express();


// Routes var 

var register = require('./back/register');


//Moteur de template

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


//routes

app.get('/', function(req, res) {
	console.log(req.session);
	res.render('landingPage');
});

app.get('/signup', function(req, res) {
	res.render('signup');
});

app.use('/register', register);









app.listen(8080);
