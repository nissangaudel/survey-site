//package import
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const { ensureAuthenticated, forwardAuthenticated } = require('../services/auth/auth');

// usermodel
const User = require('../model/user');


router.get('/login', forwardAuthenticated, (req, res, next) => {
    res.render('pages/login')
})

router.get('/register', forwardAuthenticated, (req, res, next) => {
    res.render('pages/register')
})

router.post('/register', (req, res, next) => {
    const errors = [];

    const { name, username, email, password, password2 } = req.body;

    if (!name || !username || !email || !password || !password2) {
        errors.push({ message: 'Please Fill all fileds' });
    }

    if (password !== password2) {
        errors.push({ message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
        errors.push({ message: 'Passwords must be at least  6 character long' });
    }

    if (errors.length > 0) {
        res.render('pages/register', {
            errors,
            name,
            username,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ message: 'User with that email already exists' });
                    console.log({ user: user });
                    res.render('pages/register', {
                        errors,
                        name,
                        username,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        username,
                        email,
                        password
                    });

                    bcrypt.hash(password, 10, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are successfully registered. You can login now!');
                                console.log('user created');
                                res.redirect('/user/login');
                            })
                            .catch(err => console.log(err));
                    });
                }
            })
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/surveys',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
    });
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
});


module.exports = router;
