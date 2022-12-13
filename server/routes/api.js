const express = require('express');
const route = express.Router();
let surveyController = require('../controllers/survey');
const { ensureAuthenticated, forwardAuthenticated } = require('../services/auth/auth');


route.post('/survey/create', ensureAuthenticated, surveyController.AddSurvey);
route.get('/survey/get', surveyController.GetSurvey);
route.post('/survey/add_response/:id', surveyController.AddResponse);
route.post('/survey/edit/:id', surveyController.Edit);
route.get('/survey/delete/:id', surveyController.Delete);
module.exports = route;

