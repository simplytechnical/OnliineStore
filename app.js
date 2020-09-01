var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
require('dotenv').config();


var app = express();
const { I18n } = require('i18n');
var cookieParser = require('cookie-parser');

const i18n = new I18n({
  locales: ['en', 'ar'],
  directory: path.join(__dirname, 'locales'),
  register: global 
});
app.use(i18n.init);
const passport = require('./config/passportConfig');

var session = require("express-session"),
    bodyParser = require("body-parser");

app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'sdoiuoweqijr.m.,cxvoiuoihrtn',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true } // for https connection
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  const lang = req.cookies.lang;
  if (lang) {
    res.setLocale(lang);
  }
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
