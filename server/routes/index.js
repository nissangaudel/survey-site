const express = require('express');
const route = express.Router();
const axios = require('axios');

const { ensureAuthenticated, forwardAuthenticated } = require('../services/auth/auth');
const router = require('./users');

// index route
route.get('/', forwardAuthenticated, (req, res, next) => {
    res.render('index', { title: 'EasySurveys - Create and Track Survyes' })
});

route.get('/guest', forwardAuthenticated, (req, res, next) => {
    axios.get(`http://localhost:3000/api/survey/get`)
        .then(function (surveys) {
            console.log(surveys);
            res.render('pages/guest', { surveys: surveys.data, title: 'EasySurveys - Create and Track Survyes' })
        })
        .catch(function (err) {
            req.flash('error_msg', err);
        })
})

route.get('/surveys', ensureAuthenticated, (req, res, next) => {
    axios.get(`http://localhost:3000/api/survey/get`)
        .then(function (surveys) {
            res.render('pages/surveys', { surveys: surveys.data, title: 'EasySurveys- Create and Track Survyes' });
        })
        .catch(function (err) {
            req.flash('error_msg', err);
        })
})

route.get('/select_survey', ensureAuthenticated, (req, res, next) => {
    res.render('pages/select_survey', { title: 'EasySurveys- Create Survey' })
})

route.get('/create_survey', ensureAuthenticated, (req, res, next) => {
    res.render('pages/create_survey', { title: 'EasySurveys - Create Survey' })
})

route.get('/edit', ensureAuthenticated, (req, res, next) => {
    axios.get(`http://localhost:3000/api/survey/get/?id=${req.query.id}`)
        .then(function (surveys) {
            console.log(surveys.data);
            res.render('pages/update_survey', { surveys: surveys.data, title: 'EasySurveys - Update Survey' })
        })
        .catch(function (err) {
            req.flash('error_msg', err);
        })
})

route.post('/select_survey', ensureAuthenticated, (req, res, next) => {
    res.render('pages/create_survey', { type: req.body.type, title: 'EasySurveys - Create Survey' })
})

route.get('/user_surveys', ensureAuthenticated, (req, res, next) => {
    axios.get(`http://localhost:3000/api/survey/get/?email=${req.query.email}`)
        .then(function (surveys) {
            res.render('pages/user_surveys', { surveys: surveys.data, title: 'EasySurveys - Your Surveys' });
        })
        .catch(function (err) {
            req.flash('error_msg', err);
        })
})

route.get('/analytics', ensureAuthenticated, (req, res, next) => {
    axios.get(`http://localhost:3000/api/survey/get/?id=${req.query.id}`)
        .then(function (surveys) {
            res.render('pages/analytics', { surveys: surveys.data, title: 'EasySurveys - Track Survey' });
        })
        .catch(function (err) {
            req.flash('error_msg', err);
        })
})

route.get('/delete/:id', ensureAuthenticated, (req, res, next) => {
    axios.get(`http://localhost:3000/api/survey/delete/${req.params.id}`)
        .then(function (response) {
            console.log(response.data);
            req.flash('success_msg', 'Survey Deleted Sucessfully')
            res.redirect(`/user_surveys/?email=${req.user.email}`);
        })
        .catch(function (err) {
            req.flash('error_msg', err);
        })
})

module.exports = route;