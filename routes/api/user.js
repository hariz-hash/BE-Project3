const express = require('express')
const router = express.Router();
const productDataLayer = require('../../dal/product')
const {checkIfAuthenticatedJWT} = require('../../middlewares')
const { User } = require('../../models');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userLayer = require('../../dal/user')


const generateAccessToken = (username, email, id, role_id, secret, expiresIn) => {
    return jwt.sign({
        'username': username,
        'id': id,
        'email': email,
        'role_id': role_id
    }, process.env.TOKEN_SECRET, {
        expiresIn: "1h"
    });
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}



router.post('/login', express.json(), async (req, res) => {
    console.log("ge")
    let user = await User.where({
        'email': req.body.email,
        
    }).fetch({
        require: false
    });

    if (user && user.get('password') == getHashedPassword(req.body.password)) {
        let accessToken = generateAccessToken(user);
        res.send({
            accessToken
        })
    } else {
        res.send({
            'error':'Wrong email or password'
        })
    }
})


router.post('/register',  async (req, res) => {
    
    const username = req.body.username;
    const password = getHashedPassword(req.body.password);
    const email = req.body.email;

    registerNewUser={
        username,
        password,
        email
    }

    const newUserAccount = await userLayer.addNewUser(registerNewUser,1);
    res.send({
        message: 'User registered!'
    })
})

module.exports = router