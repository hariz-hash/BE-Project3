const express = require("express");
const router = express.Router();

// import in the User model
const { User } = require('../models');

const { createRegistrationForm, bootstrapField } = require('../forms');

router.get('/register', (req,res)=>
{
    //display registration form
    const registerForm = createRegistrationForm();
    res.render('/user/register',
    {
        'form': registerForm.toHTML(bootstrapField)
    })
})

module.exports = router;