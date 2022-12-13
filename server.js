// require packages import
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const User = require('./server/model/user');

const flash = require('connect-flash');

const routes = require('./server/routes/index');
const connectDB = require('./server/db/connection');

//initialize express app
const app = express();

//passport startagy
require('./server/services/auth/passport')(passport);

//points to the config file 
dotenv.config({ path: 'config.env' });

const PORT = process.env.PORT || 8080

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));



connectDB();

//define the view engine
app.set('view engine', 'ejs');

//express-sessions
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.resolve(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'node_modules')));


//connect-flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

//routes
app.use('/', routes);
app.use('/user', require('./server/routes/users'));
app.use('/api', require('./server/routes/api'));


app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
})

