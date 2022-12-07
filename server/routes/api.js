const express = require('express');
const route = express.Router();
let surveyController = require('../controllers/survey');
const { ensureAuthenticated, forwardAuthenticated } = require('../services/auth/auth');


route.post('/survey/create', ensureAuthenticated, surveyController.AddSurvey);
route.get('/survey/get', surveyController.GetSurvey);

module.exports = route;

