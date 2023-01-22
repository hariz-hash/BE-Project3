
const express = require('express');
const router = express.Router();
const dataLayer = require('../../dal/order');
const { checkIfAuthenticatedJWT } = require('../../middlewares')


router.get('/', checkIfAuthenticatedJWT, async function (req, res) {
    const userId = req.user.id;
    const orders = await dataLayer.retrieveOrderByUser(userId);
    res.send({ orders });
    console.log(userId)
    
});

module.exports = router;