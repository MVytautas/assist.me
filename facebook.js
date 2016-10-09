var request    = require('request');

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
        console.log("message sent");
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

function getConversations() {
    request({
        url: 'https://graph.facebook.com/v2.6/me/conversations',
        qs: {access_token: "EAACN3fv7nN0BAO1qGPq12NswFtP8L9RWN3YE9IFl1K9wvAQDla4THwqg7Bpwh73ebM8MSvnfJMfZAvPZBTrWroalp7ZACZBcw5DSS1xFU2GDqHIMKpb1K9wkoMMfmfFFntzNfmrwuA33Vu45UQq2vuoqyzKsWSINfrFsksbtfAZDZD"},
        method: 'GET'
    }, function(error, response, body) {
        // console.log("Getting conversations");
        // console.log(response, body);
        
        // return { error: error, response: response, body: body };
    });
}

module.exports = {
    getConversations: getConversations,
    sendMessage: sendMessage 
};