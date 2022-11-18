const express = require('express');
const route = express.Router();


// index route
route.get('/', (req, res, next) => {
    res.render('index')
});

route.get('/login', (req, res, next) => {
    res.render('pages/login')
});

route.get('/register', (req, res, next) => {
    res.render('pages/register')
})


module.exports = route;