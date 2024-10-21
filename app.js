const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const favicon = require('serve-favicon');

const indexRouter = require('./routes/index');
const costumesRouter = require("./routes/costumes.js");
const insertRouter = require("./routes/insert.js");
const updateRouter = require("./routes/update.js");
const deleteRouter = require("./routes/delete.js");

const mongoose = require("mongoose");
const mongoDbUrl = require("./config.json").db_url;

mongoose.connect(mongoDbUrl, err => {
	if (err) console.error(err);
	console.log("connected");
});
mongoose.set('debug', true);

const app = express();
app.use(favicon(path.join(__dirname, 'public/images', 'icon32.png')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/costumes', costumesRouter);
app.use('/insert', insertRouter);
app.use("/update", updateRouter);
app.use("/delete", deleteRouter);

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.locals.error.status = err.status || 500;
	res.status(err.status || 500);
	// render the error page
	res.render('error');
	console.error(err);
});

module.exports = app;
