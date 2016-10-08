var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var QuestionSchema   = new Schema({
    id: Number,
    text: String,
    count: String
});

module.exports = mongoose.model('Question', QuestionSchema);