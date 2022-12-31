const express = require("express");
const router = express.Router();

// import in the User model
const { User } = require('../models');

const { createRegistrationForm, bootstrapField, createLoginForm } = require('../forms');

router.get('/register', (req, res) => {
    //display registration form
    const registerForm = createRegistrationForm();
    res.render('user/register',
        {
            'form': registerForm.toHTML(bootstrapField)
        })
})
router.post('/register', (req, res) => {
    const registerForm = createRegistrationForm();
    registerForm.handle(req, {
        success: async (form) => {
            const { confirm_password, ...userData } = form.data;
            userData.role_id = 2;
            
            const user = new User(userData);
            await user.save();
            console.log(userData)
            req.flash("success_messages", "User signed up successfully!");
            res.redirect('/users/login')
        },
        'error': (form) => {
            res.render('users/register', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
router.get('/login', (req, res) => {
    const registerForm = createLoginForm();
    res.render('user/register',
        {
            'form': registerForm.toHTML(bootstrapField)
        })
})
router.post('/login', (req, res) => {
    const loginForm = createLoginForm();
    loginForm.handle(req,{
        'success': async function(form) {
            // 1. we need to check if there is a user with the provided email address
            // 2. if there is a user with that email address, check if the password matches
            const user = await User.where({
                'email': form.data.email,
                'password': form.data.password
            }).fetch({
                require: false
            })

            if (user) {
                  // 3. if both 1 and 2 passes, then the user exists
                  //     and we use the session for the client to remember that this client has logged in as that user
                  
                  // req.session represents the session file
                  // when we do `req.session.user` we are adding a new key named `user` to the session
                  // and the session file will auto save after the response is sent back
                  req.session.user = {
                    'id': user.get('id'),
                    'username': user.get('username'),
                    'email': user.get('email')
                  }
                  req.flash('success_messages', "Login successful!");
                  res.redirect('/products');
        
            } else {
                req.flash('error_messages', "Your login credentials is invalid");
                res.redirect('/users/login');
            }
          
        },
        'error': function(form) {
            res.render('users/login', {
                'form': form
            })
        },
        'empty': function(form) {
            res.render('users/login', {
                'form': form
            })
        }
    })
})
module.exports = router;