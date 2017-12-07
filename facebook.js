var request    = require('request');

function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: "EAACN3fv7nN0BAKH0chaIwdUGgNUbWFFP7csbIMDvS4gzUWSk9g8TTKClJEkvtFXLZBWLA3FL9E0rev8cKrS5FZBmM5TsHjZCCmelZAwE5dFSZCGnIYMkVNGFUEnlrZCJfEyU2eIblrWtgd2K0OEAF6bCSyvAUi5ZC54BfnDjK5RZB0IBQm41WJ9Q"},
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
        qs: {access_token: "EAACN3fv7nN0BAKH0chaIwdUGgNUbWFFP7csbIMDvS4gzUWSk9g8TTKClJEkvtFXLZBWLA3FL9E0rev8cKrS5FZBmM5TsHjZCCmelZAwE5dFSZCGnIYMkVNGFUEnlrZCJfEyU2eIblrWtgd2K0OEAF6bCSyvAUi5ZC54BfnDjK5RZB0IBQm41WJ9Q"},
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