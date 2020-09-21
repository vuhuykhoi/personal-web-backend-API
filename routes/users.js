var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

var User = require('../models/User');

//Login Page
router.get('/login', (req, res) => {
    res.render('pages/user/login', { title: 'Login' });
});

//Register Page
router.get('/register', (req, res) => {
    res.render('pages/user/register', { title: 'Register' });
});

//Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //Check required field
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all feilds' });
    }

    //Check password match
    if (password !== password2) {
        errors.push({ msg: 'Passworld does not match' });
    }

    //Check pass length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('pages/user/register', {
            title: "Register",
            errors,
            name,
            password,
            password2
        });
    } else {
        //Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //User exist
                    errors.push({ msg: "Email is already registered" });
                    res.render('pages/user/register', {
                        title: "Register",
                        errors,
                        name,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //Hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //Set password to hash
                            newUser.password = hash;
                            //Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registed and can log in');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }))
                }
            })

    }
})
module.exports = router;