const express = require('express');
const route = express.Router();
const axios = require('axios');

const { ensureAuthenticated, forwardAuthenticated } = require('../services/auth/auth');
const router = require('./users');

// index route
route.get('/', forwardAuthenticated, (req, res, next) => {
    res.render('index')
});

route.get('/guest', forwardAuthenticated, (req, res, next) => {
    res.render('pages/guest')
})

route.get('/surveys', ensureAuthenticated, (req, res, next) => {
    axios.get(`http://localhost:3000/api/survey/get`)
        .then(function (surveys) {
            console.log(surveys);
            res.render('pages/surveys', { surveys: surveys.data });
        })
        .catch(function (err) {
            req.flash('error_msg', err);
        })
})

route.get('/select_survey', ensureAuthenticated, (req, res, next) => {
    res.render('pages/select_survey')
})

route.get('/create_survey', ensureAuthenticated, (req, res, next) => {
    res.render('pages/create_survey')
})

route.post('/select_survey', ensureAuthenticated, (req, res, next) => {
    res.render('pages/create_survey', { type: req.body.type })
})


module.exports = route;