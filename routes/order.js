const express = require("express");
const router = express.Router();
const dataLayer = require('../dal/order')
const { checkIfAuthenticated } = require('../middlewares');

router.get('/', checkIfAuthenticated, async(req,res)=>
{
    const orders = await dataLayer.retrieveAllOrders()
    const status = await dataLayer.retrieveStatus()
    res.render('order/index',
    {
        orders: orders.toJSON()
    })
})

module.exports = router;