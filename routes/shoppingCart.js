const express = require("express");
const router = express.Router();

const CartServices = require('../services/cart_services');

router.get('/', async(req,res)=>{
    let cart = new CartServices(req.session.user.id);
    res.render('cart/index', {
        'shoppingCart': (await cart.getCart()).toJSON()
    })
})