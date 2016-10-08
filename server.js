// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var server     = require('http').Server(app);
var io         = require('socket.io')(server);



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

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    
    next(); // make sure we go to the next routes and don't stop here
    
    var data = {
        question: "event.message.text",
        suggestions: [
            "First suggestion",
            "Second suggestion",
            "Third suggestion"
        ]
    };
    
    io.emit('question', data);
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

var databaseHandler = require('./databaseHandler');

// on routes that end in /questions
// ----------------------------------------------------
router.route('/questions')
    // create a question (accessed at POST http://localhost:8080/api/questions)
    .post(function(req, res) {

        res.json({ message: databaseHandler.update('questions', req.body.text) });
  
    });

router.route('/answers')

    .post(function(req, res) {
      res.json({ message: databaseHandler.update('answers', req.body.text) });
    });

// Facebook Webhook
router.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

router.get('/socket.io', function(req, res) {

});

var facebook = require('./facebook');

// handler receiving messages
router.post('/webhook', function (req, res) {
    console.log('Webhook listens');
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {

            if ( ! event.message.is_echo) { databaseHandler.update("questions", event.message.text); }
            
            facebook.sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);