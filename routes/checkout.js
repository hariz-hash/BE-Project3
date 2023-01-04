const express = require('express');
const { CartItem } = require('../models');
const router = express.Router();

const cartServices = require('../services/cart_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', async (req, res) => {
 

    const itemsFromCart = await cartServices.getUserCart(req.session.user.id)

    const lineItems = [];

    const meta = [];
    for(let i of CartItem) {
        const lineItems = {
            'quantity': i.get('quantity'),
            'price_data':{
                'currency':'SGD',
                'unit_amount': i.related('variant').get('cost'),
                'product_data':{
                    'name': i.related('variant').get('')
                }
            }
        }
    }
})

module.exports = router;