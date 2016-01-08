var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var root = require('./routes/root.js');
var auth = require('./routes/auth.js');
var api = require('./routes/api.js');
var configDB = require('./config/database.js');
var server = require('./bin/www');
var io = require("socket.io").listen(3001);
var chat = require('./sockets/chat.js')(io);

require('./sockets/chat.js');
require('./config/passport')(passport);
mongoose.connect(configDB.url);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/src/')));

app.use(session({ secret : 'supersecretsession' , resave : false, saveUninitialized : false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', root);
app.use('/auth', auth);
app.use('/api', api);

module.exports = app;
