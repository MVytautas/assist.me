// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var http       = require('http');
var path       = require('path');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var socketio   = require('socket.io');

var bodyParser = require('body-parser');
var databaseHandler = require('./databaseHandler');
var facebook = require('./facebook');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://preview.c9users.io");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
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
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            
            if ( ! event.message.is_echo) {
                databaseHandler.update("questions", event.message.text);
                var data = {
                    question: event.message.text,
                    suggestions: [
                        "First suggestion",
                        "Second suggestion",
                        "Third suggestion"
                    ]
                };
                
                io.emit('question', data);
                
                senderId = event.sender.id;
            }
            // console.log("sender id:" + event.sender.id);
            // facebook.sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// ----------------------------------------------------
router.route('/questions').post(function(req, res) {
    res.json({ message: databaseHandler.update('questions', req.body.text) });
});

router.route('/answers').post(function(req, res) {
  res.json({ message: databaseHandler.update('answers', req.body.text) });
});

// REGISTER OUR ROUTES -------------------------------
app.use(express.static(path.resolve(__dirname, 'client')));
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
var server = app.listen(process.env.PORT || 3000);
var io     = require('socket.io').listen(server);

// Add a connect listener
io.on('connection', function(socket) {

    console.log('Client connected.');

    // Disconnect listener
    socket.on('disconnect', function() {
        console.log('Client disconnected.');
    });
    
    socket.on('answer', function(data) {
        facebook.sendMessage(senderId, {text: data});
        databaseHandler.update('answers', data);
    });
});