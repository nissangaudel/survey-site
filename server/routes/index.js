const express = require('express');
const route = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../services/auth/auth');

// index route
route.get('/', (req, res, next) => {
    res.render('index')
});

route.get('/guest', forwardAuthenticated, (req, res, next) => {
    res.render('pages/guest')
})

route.get('/surveys', ensureAuthenticated, (req, res, next) => {
    res.render('pages/surveys')
})

route.get('/select_survey', ensureAuthenticated, (req, res, next) => {
    res.render('pages/select_survey')
})


module.exports = route;