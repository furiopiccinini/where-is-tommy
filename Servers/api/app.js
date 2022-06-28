/**
@summary Tales for Makers - Where is Tommy? \n
Project: parking meter remake\n

The project is made with different tecnologies:

----- Nicla Sense ME board
            |
            |
        Python script
            |
            |
        Node.js server
            |
            |
        React app



At the root we have a Nicla Sense ME firmware to create the motion gestures sensor. Sensor data
are integrated to the required range of values and converted in a JSON string. 
The string is sent to the host via the USB-Serial interface and captured by HTTP
the Node.js server.

This app.js is the main Node.js file, generated with express-generator. It exposes the /api endpoint with GET and POST methods.
In the project root you can find the file named "Where is Tommy.postman_collection.json": this is the exported collection 
of all the APIs available in the Node.js server, along with an example JSON payload.

This project uses JSDoc as a documentation tool. After installing JSDoc with "npm install -g jsdoc" (global install)
or with "npm install --save-dev jsdoc" (local install as dev dependency), to generate the documentation for the source 
simply cd into the "api" folder and run "jsdoc app.js". All the documentation will be generated in the "out" folder.
The /api endpoint is in the "routes" folder, so to generate the docs follow the same procedure in this path.

@author Furio Piccinini <furiopiccinini@gmail.com>
Date Apr 2022
@version 0.8.6
@license: Apache
*/

/** Import statements */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
/** CORS module to enable Cross Origin Resource Sharing 
 * @module
*/
var cors = require('cors');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
/** @external */
var apiRouter = require('./routes/api'); // require new route created

var app = express();

/** view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
/** Middleware setup */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors()); /** cors instantiation */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
/** new route to handle incoming JSON data */
app.use('/api', apiRouter);

/** catch 404 and forward to error handler */
app.use(function (req, res, next) {
  next(createError(404));
});

/** error handler */
app.use(function (err, req, res, next) {
  /** set locals, only providing error in development */
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /** render the error page */
  res.status(err.status || 500);
  res.render('error');
});

/** @exports */
module.exports = app;
