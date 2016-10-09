var JsonDB = require('node-json-db');
//The second argument is used to tell the DB to save after each push 
//If you put false, you'll have to call the save() method. 
//The third argument is to ask JsonDB to save the database in an human readable format. (default false) 
var db = new JsonDB("db", true, true);

function update(arrayName, text) {
    console.log('In ' + arrayName + ' array');
    
    var item = {};
    var id = 1;
    
    try {
        id = db.getData("/" + arrayName + "[-1]/id") + 1;
    } catch(error) {
        
    }
    
    var exists = false;
    
    if (id !== 1) {
        db.getData("/" + arrayName).forEach(function (arrayItem, index) {
            if (arrayItem.text !== text || exists) { return; }
            // item.count += 1;
            db.push("/" + arrayName + "[" + index + "]/count", arrayItem.count += 1);
            exists = true;
        });
    }
    
    if (exists) { return id; }

    console.log('Adding item');
    
    item.text = text;      // set the question text (comes from the request)
    item.id = id;
    item.count = 1;
    
    var arrayKey = id - 1;

    db.push("/" + arrayName + "[" + arrayKey + "]", item);
    
    return id;
}

function searchObjectsArrayByProperty(arrayName, property, value) {
    var item;
    
    db.getData("/" + arrayName).forEach(function (arrayItem, index) {
        if (arrayItem[property] !== value) { return; }
        item = arrayItem;
    });
    
    return item;
}


function searchObjectsArrayById(arrayName, answerId) {
    var item;
    
    db.getData("/" + arrayName).forEach(function (arrayItem, index) {
        if (arrayItem.id !== answerId) { return; }
        item = arrayItem;
    });
    
    return item;
}

function addLink(question, answerId) {
    var questions = db.getData("/questions");
    var questionId;
    
    console.log("Klausimas: " + question);
    console.log("Atsakymo ID: " + answerId);
    
    if (question === undefined) { return; }
    
    questions.forEach(function(item){
        if (item.text !== question) { return; }
        questionId = item.id;
    });
    
    var answerObject = searchObjectsArrayById('answers', answerId);
    
    if (answerObject === undefined) { return; }
    
    var answer = answerObject.text;
    console.log("Atsakymo tekstas: " + answer);
    
    
    db.push("/links/" + questionId + "[]", answer);
}

function getSuggestions(question) {
    var suggestions,
        questionObject;
        
    questionObject = searchObjectsArrayByProperty('questions', 'text', question);
    
    if (questionObject === undefined || questionObject.id === undefined) { return []; }
    var questionId = questionObject.id;
    
    suggestions = db.getData("/links/" + questionId);
    if (suggestions === undefined) { return []; }
    
    console.log("Suggestions:", suggestions);
    
    return suggestions;
}

module.exports = {
    addLink: addLink,
    getSuggestions: getSuggestions,
    update: update
};