var createError = require('http-errors');
var express = require('express');
var config = require('./config');
var auth = require('./authorization/auth');
var session = require('express-session');
var mw = require('./middleware/middlewares');

//set up mongoose connection
var connectionString = require('./config').DB;
var mongoose = require('mongoose');
mongoose.connect(connectionString);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var songsRouter = require('./routes/songs');
var partsRouter = require('./routes/parts');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});
//
app.all('/songs', mw.verify_JWT_MW);
//app.all('/users', mw.verify_JWT_MW);
app.all('/parts', mw.verify_JWT_MW);

app.use('/', indexRouter);
app.use('/songs', songsRouter);
app.use('/users', usersRouter);
app.use('/parts', partsRouter);
app.use('/auth', authRouter);


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
