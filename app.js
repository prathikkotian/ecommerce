var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sessions = require('express-session');
var loginRouter = require('./routes/login');
var addRouter = require('./routes/add');
var multiplyRouter = require('./routes/multiply');
var divideRouter = require('./routes/divide');
var logoutRouter = require('./routes/logout');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session properties
app.use(sessions({
  secret:'kfebwfwkjb5654fvfwe',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 900000 }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// route post requests
app.use('/login', loginRouter);
app.use('/add', addRouter);
app.use('/multiply', multiplyRouter);
app.use('/divide', divideRouter);
app.use('/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
