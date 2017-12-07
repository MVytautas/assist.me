var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var fs = require('fs');
var facebook = require('./facebook');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.set('view engine', 'ejs'); // template engine
//app.engine('html', require('ejs').renderFile); // turn engine to use html

app.get('/', function(request, response) {
  var readFile = "client/index.html";
  var fileContents = fs.readFileSync(readFile);
  
  response.send(fileContents.toString());
  });

  // Facebook Webhook
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'testbot_verify_token') {
      res.send(req.query['hub.challenge']);
  } else {
      res.send('Invalid verify token');
  }
});

var senderId;

// handler receiving messages
app.post('/webhook', function (req, res) {
  console.log("Facebook webhook fired - message from Facebook received.");
  var events = req.body.entry[0].messaging;
  var i = 0;
  
  for (i; i < events.length; i++) {
      var event = events[i];
      if (event.message && event.message.text) {
          
          if ( ! event.message.is_echo) {
              databaseHandler.update("questions", event.message.text);
              var data = {
                  question: event.message.text,
                  suggestions: databaseHandler.getSuggestions(event.message.text)
              };
              
              global.io.emit('question', { "data": data, "sender": event.sender.id });
              
              senderId = event.sender.id;
          }
      }
  }
  res.sendStatus(200);
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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


module.exports = app;
