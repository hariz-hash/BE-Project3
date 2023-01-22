const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const { User } = require('../models')
const { checkIfAuthenticated } = require('../middlewares');

// import in the User model

const { createRegistrationForm, bootstrapField, createLoginForm } = require('../forms');

router.get('/register', (req, res) => {
    //display registration form
    try {
        const registerForm = createRegistrationForm();
        res.render('user/register',
            {
                'form': registerForm.toHTML(bootstrapField)
            })
    } catch (err) {
        next(err);
    }

})
router.post('/register', (req, res) => {
    try {
        const registerForm = createRegistrationForm();
        registerForm.handle(req, {
            success: async (form) => {
                const { confirm_password, ...userData } = form.data;
                userData.role_id = 2;
                userData.password = getHashedPassword(userData.password)
                const user = new User(userData);
                await user.save();
                // console.log(userData)
                req.flash("success_messages", "User signed up successfully!");
                res.redirect('/users/login')
            },
            'error': (form) => {
                res.render('users/register', {
                    'form': form.toHTML(bootstrapField)
                })
            }
        })
    } catch (err) {
        next(err);
    }
})
router.get('/login', (req, res) => {
    try {
        const loginForm = createLoginForm();
        res.render('user/login',
            {
                'form': loginForm.toHTML(bootstrapField)
            })
    } catch (err) {
        next(err);
    }
})
router.post('/login', async (req, res) => {
    try {
        const loginForm = createLoginForm();
        loginForm.handle(req, {
            'success': async (form) => {
                // process the login

                // ...find the user by email and password
                let user = await User.where({
                    'email': form.data.email
                }).fetch({
                    require: false
                }
                );

                if (!user) {
                    req.flash("error_messages", "Sorry, the authentication details you provided does not work.")
                    res.redirect('/users/login');
                } else {
                    // check if the password matches
                    if (user.get('password') === getHashedPassword(form.data.password)) {
                        // add to the session that login succeed

                        // store the user details
                        req.session.user = {
                            id: user.get('id'),
                            username: user.get('username'),
                            email: user.get('email')
                        }
                        req.flash("success_messages", "Welcome back, " + user.get('username'));
                        res.redirect('/products');
                    } else {
                        req.flash("error_messages", "Sorry, the authentication details you provided does not work.")
                        res.redirect('/user/login')
                    }
                }
            }, 'error': (form) => {
                req.flash("error_messages", "There are some problems logging you in. Please fill in the form again")
                res.render('user/login', {
                    'form': form.toHTML(bootstrapField)
                })
            }
        })
    } catch (err) {
        next(err);
    }
})
router.get('/profile', checkIfAuthenticated, (req, res) => {
    try{

    
    const user = req.session.user;
    if (!user) {
        req.flash('error_messages', 'You do not have permission to view this page');
        res.redirect('/users/login');
    } else {
        res.render('user/profile', {
            'user': user
        })
    }
}catch (err) {
    next(err);
}
})
router.get('/logout', (req, res) => {
    try{


    req.session.user = null;
    req.flash('success_messages', "Goodbye");
    res.redirect('/users/login');
}catch (err) {
    next(err);
}
})
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}
module.exports = router;