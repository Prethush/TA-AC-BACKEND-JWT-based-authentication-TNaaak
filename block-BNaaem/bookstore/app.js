var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');


mongoose.connect("mongodb://127.0.0.1:27017/bookStore",  { useNewUrlParser: true,  useUnifiedTopology: true }, (err) => {
  console.log(err ? err : "connected to db")
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bookRouter = require('./routes/books');
var newBookRouter = require('./routes/newbooks');
var commentRouter = require('./routes/comments');
var updatedBookRouter = require('./routes/newbooks2');
var bookVersion4 = require('./routes/newbooks3');
var commentVersion2 = require('./routes/comments2');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/v1/books', bookRouter);
app.use('/api/v2/books', newBookRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v3/books', updatedBookRouter);
app.use('/api/v4/books', bookVersion4);
app.use('/api/v2/comments', commentVersion2);

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
