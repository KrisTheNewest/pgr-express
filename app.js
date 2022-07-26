const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const bodyParser = require('body-parser');
const logger = require("./logger.js");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const costumesRouter = require("./routes/costumes.js");
const insertRouter = require("./routes/insert.js");

const mongoose = require("mongoose");
const mongoDB = 'mongodb://127.0.0.1/my_database';

// var express = require('express');
mongoose.connect(mongoDB, err => {
  if (err) console.error(err);
  console.log("connected");
 })//.then(() => .catch(err =>console.error(err));
mongoose.set('debug', true);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
// app.use(sassMiddleware({
//   src: path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   indentedSyntax: true, // true = .sass and false = .scss
//   sourceMap: true
// }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/costumes', costumesRouter);
app.use('/insert', insertRouter);

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
// app.use('/js', express.static(path.join(_dirname, 'node_modules/jquery/dist')))
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler

app.use(function(err, req, res, next) {
  logger.error(err); // adding some color to our logs
  // console.log(err);
  next(err); // calling next middleware
});

app.use(function(err, req, res, next) {
  // console.log(err)
  // set locals, only providing error in development
  res.locals.message = err.message.replace(/\033\[[0-9;]*m/g,"");
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status|| 500);
  
  res.render('error');
});

module.exports = app;
