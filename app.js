// Change directory to CWD for Upstart
 process.chdir(__dirname);

//Core Modules
var path = require('path');
var http = require("http");
var https = require("https");
var crypto = require('crypto');
var fs = require('fs');

//Public Modules From NPM
var express = require('express');
var config = require('konfig')()
var logfmt = require('logfmt')
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Custom Module 
var web = require('./routes/web');
var present = require('./routes/present');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Express 4.0 Stuffs
app.use(favicon(path.join(__dirname,'/public/images/favicon.ico')));
app.use(logger('dev'));
app.use(logfmt.requestLogger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.enable('view cache')


//Set Ports
app.set('port', config.app.port);
app.set('port_https', config.app.port_https);


// Pass down variables to views
app.locals.API = config.app.API
app.locals.FB_ID = config.app.FB_ID





// Custom Routings
app.get('/', web.index);
app.get('/privacy', web.privacy);
app.get('/p/:id', present.single);
//app.get("/p/covers/:id", covers.get);





/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



//CreateServer
if (config.app.https_private_key) {
  var options = {
    key: fs.readFileSync(config.app.https_private_key),
    cert: fs.readFileSync(config.app.https_cert)
  };
  https.createServer(options, app).listen(app.get("port_https"), (function(_this) {
    return function() {
      return console.log("Magic Happens on port " + app.get("port_https"));
    };
  })(this));
} else {
  http.createServer(app).listen(app.get("port"), function() {
    return console.log("Magic Happens on port " + app.get("port"));
  });
}



