const mongoose = require('mongoose');

var surveySchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    choices: {
        type: Array
    },
    creator: {
        type: String
    },
    expires: {
        type: Date,
        required: true,
    }
});

const Survey = mongoose.model('Survey', surveySchema);
module.exports = Survey;