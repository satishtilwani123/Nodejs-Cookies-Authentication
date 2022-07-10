var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')

const url = "mongodb://localhost:27017";

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dish');

mongoose.connect(url).then((db) => {
  console.log(db);
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('1234-5678-9012-3456'));

//Cookies Authentication
function auth(req, res, next) {

  if(!req.signedCookies.user)
  {
    console.log("Signed Cookies");
    var auth_header = req.headers.authorization;

    if(!auth_header){
      var err = new Error("You are not authenticated");
      err.status = 401;
      res.setHeader('WWW-Authenticate', 'Basic');
      return next(err);
    }

    var Buff = new Buffer.from(auth_header.split(' ')[1], 'base64').toString().split(':');
    var username = Buff[0];
    var password = Buff[1];

    if(username == "admin" && password == "admin"){
      res.cookie('user', 'admin', {signed: true});
      next();
    } else {
      var err = new Error("You are not authenticated");
      err.status = 401;
      res.setHeader('WWW-Authenticate', 'Basic');
      return next(err);
    }
  } else {
    if(req.signedCookies.user == 'admin'){
      console.log("Checking Signed Cookies")
      next();
    } else {
      console.log("Signed Cookies Errors");
      var err = new Error("You are not authenticated");
      err.status = 401;
      return next(err);
    }
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
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
