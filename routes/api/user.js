const express = require('express')
const router = express.Router();
const productDataLayer = require('../../dal/product')
const { checkIfAuthenticatedJWT } = require('../../middlewares')
const { User, BlacklistedToken } = require('../../models');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userLayer = require('../../dal/user');
const { Router } = require('express');


const generateAccessToken = (userLoginDetails, secret, expiry) => {
    return jwt.sign({
        'username': userLoginDetails.username,
        'email': userLoginDetails.email,
        'id': userLoginDetails.id,
        'role_id': userLoginDetails.role_id,
    }, secret, {
        expiresIn: expiry
    });
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.post('/login', express.json(), async (req, res) => {

    // const loggedInAccount = req.user
    // res.json({ loggedInAccount })
    // console.log("ge")
    let user = await User.where({
        'email': req.body.email,

    }).fetch({
        require: false
    });

    if (user && user.get('password') == getHashedPassword(req.body.password)) {
        const userLoginObject = {
            'username': user.get('username'),
            'email': user.get('email'),
            'id': user.get('id'),
            'role_id': user.get('role_id')
        }
        let accessToken = generateAccessToken(userLoginObject, process.env.TOKEN_SECRET, '1h');
        let refreshToken = generateAccessToken(userLoginObject, process.env.REFRESH_TOKEN_SECRET, '7d');
        res.json({
            'accessToken': accessToken,
            'refreshToken': refreshToken
        })
    } else {
        res.send({
            'error': 'Wrong email or password'
        })
    }
})

// router.post('/refresh', async (req, res) => {
//     let refreshToken = req.body.refreshToken;
//     if (!refreshToken) {
//         res.json({
//             "error": "token does not exist"
//         });
//     }
//     const blacklistedToken = await BlacklistedToken.where({
//         'token': refreshToken
//     }).fetch({
//         require: false
//     })

//     console.log(blacklistedToken)

//     if (blacklistedToken) {
//         res.status(403);
//         res.json({
//             'error': 'fresh token black listed'
//         });
//         return;
//     }
//     else {
//         jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, payload) {
//             if (err) {
//                 res.json({
//                     'error': 'The refresh token has been invalidated. Please log again'
//                 });
//                 return;
//             }
//             // create a new access token
//             let accessToken = generateAccessToken(payload, process.env.TOKEN_SECRET, '15m');
//             res.json({
//                 'accessToken': accessToken
//             })
//         })
//     }

// })

router.post('/register', async (req, res) => {

    const username = req.body.username;
    const password = getHashedPassword(req.body.password);
    const email = req.body.email;

    registerNewUser = {
        username,
        password,
        email
    }
    // console.log({ registerNewUser })
    const newUserAccount = await userLayer.addNewUser(registerNewUser, 1);
    res.send({
        message: 'User registered!'
    })
})


// router.post('/logout', async(req,res) =>
// {
//     req.flash('success_messages', "Goodbye");
//     res.redirect('/users/login');
// })

// router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {

//     const loggedInAccount = req.user
//     res.send(loggedInAccount.id)
//     res.json({ loggedInAccount })

// })

router.post('/logout', async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (refreshToken) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async function (err, tokenData) {
                if (!err) {
                    const token = new BlacklistedToken();
                    token.set('token', refreshToken);
                    token.set('date_created', new Date());
                    await token.save();

                    res.send({ "message": 'See you soon!' })
                }
            }
        );
    } else {
        res.send({ error: 'no refresh token found' })
    }
})


//TEST------------------------------------------------------

router.post('/refresh', async (req, res) => {

    let refreshToken = req.body.refreshToken;
    if (refreshToken) {
        const blacklisted_token = await BlacklistedToken.where({
            token: refreshToken,
        }).fetch({
            require: false,
        });

        if (blacklisted_token) {
            res.status(400);
            res.json({
                error: "Refresh token has been blacklisted",
            });
            return;
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            function (err, payload) {
                if (!err) {
                    let accessToken = generateAccessToken(
                        payload, process.env.TOKEN_SECRET,
                        '1h'
                    );
                    res.json({
                        'accessToken': accessToken
                    })
                } else {
                    res.json({
                        'error': 'The refresh token has been invalidated. Please log again'
                    });
                }
            }
        )
    }
    else {
        res.json({
            "error": "token does not exist"
        });
    }
})

// router.post('/refresh', async (req, res) => {

// })

//TEST------------------------------------------------------
module.exports = router