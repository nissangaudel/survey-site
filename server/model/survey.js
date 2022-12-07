const mongoose = require('mongoose');

var surveySchema = mongoose.Schema({
    type: {
        type: String,
        //required: true,
    },
    title: {
        type: String,
        //required: true,
    },
    choices: {
        type: Array
    },
    creator: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    expires: {
        type: Date,
        //required: true
    },
    totalResponses: {
        type: Number,
        default: 0,
    },
    responses: {
        type: [String]
    }
});

const Survey = mongoose.model('Survey', surveySchema);
module.exports = Survey;