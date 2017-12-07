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
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
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
global.io     = require('socket.io').listen(server);

// Add a connect listener
global.io.on('connection', function(socket) {

    console.log('Client connected.');
    // socket.emit('conversations', facebook.getConversations());

    // Disconnect listener
    socket.on('disconnect', function() {
        console.log('Client disconnected.');
    });
    
    socket.on('answer', function(response) {
        console.log(response);
        facebook.sendMessage(response.user, { text: response.text });
        var answerId = databaseHandler.update('answers', response.text);
        
        databaseHandler.addLink(response.question, answerId);
    });
});