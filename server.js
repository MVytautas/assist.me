// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var request    = require('request');

var JsonDB = require('node-json-db');
//The second argument is used to tell the DB to save after each push 
//If you put false, you'll have to call the save() method. 
//The third argument is to ask JsonDB to save the database in an human readable format. (default false) 
var db = new JsonDB("myDataBase", true, true);

var dbQ = new JsonDB("QuestionsData", true, false);

var dbA = new JsonDB("AnswersData", true, false);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// on routes that end in /questions
// ----------------------------------------------------
router.route('/questions')
    .get(function(req, res) {
        
    })

    // create a bear (accessed at POST http://localhost:8080/api/questions)
    .post(function(req, res) {
        console.log('In question post');
        
        var question = {};
        
        //Pushing the data into the database 
        //With the wanted DataPath 
        //By default the push will override the old value 
        
        question.text = req.body.text;      // set the question text (comes from the request)
        question.id = 1;
        question.count = 1;

        dbQ.push('question' + question.id, question);      // create a new instance of the Bear model

        res.json({ message: 'hooray! welcome to our api!' });   
    });

router.route('/answers').get(function(req, res)
    {
        
    })
    .post(function(req, res)
    {
      console.log('Answers post');
      
      var answer = {};
      
      answer.text = req.body.text;
      answer.id = 1;
      answer.count = 1;
      
      db.push('answer' + answer.id, answer);
      
      res.json({
          message: 'hey hey!'
      });
    });

// Facebook Webhook
router.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: "EAACN3fv7nN0BAO1qGPq12NswFtP8L9RWN3YE9IFl1K9wvAQDla4THwqg7Bpwh73ebM8MSvnfJMfZAvPZBTrWroalp7ZACZBcw5DSS1xFU2GDqHIMKpb1K9wkoMMfmfFFntzNfmrwuA33Vu45UQq2vuoqyzKsWSINfrFsksbtfAZDZD"},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// handler receiving messages
router.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);