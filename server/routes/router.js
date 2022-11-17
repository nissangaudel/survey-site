const express = require('express');
const route = express.Router();


// index route
route.get('/', (req, res, next) => {
    res.render('index')
});


module.exports = route;