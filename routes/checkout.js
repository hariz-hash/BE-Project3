const express = require('express');
const { CartItem } = require('../models');
const router = express.Router();

const cartServices = require('../services/cart_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', async (req, res) => {


    const cartItems = await cartServices.getUserCart(req.session.user.id)

    const lineItems = [];

    const meta = [];
    // for(let i of itemsFromCart) {
    //     const lineItems = {
    //         'quantity': i.get('quantity'),
    //         'price_data':{
    //             'currency':'SGD',
    //             'unit_amount': i.related('variant').get('cost'),
    //             'product_data':{
    //                 'name': i.related('variant').get('stock')
    //             }
    //         }
    //     }
    //     if (i.related('variant').get('image_url')) {
    //         lineItems.price_data.product_data.images = [ i.related('variant').get('image_url')]
    //     }
    //     lineItems.push(lineItems);
    //     meta.push({
    //         'product_id': i.get('variant_id'),
    //         'quantity': i.get('quantity')
    //     })
    // }
    // // create the payment

    // // change the meta array into a JSON string
    // let metaData = JSON.stringify(meta);
    // const payment = {
    //     payment_method_types:["card"],
    //     mode:'payment',
    //     line_items: lineItems,
    //     success_url: "https://www.google.com/",
    //     cancel_url: "https://sg.yahoo.com/",
    //     metadata:{
    //         'orders': metaData
    //     }
    // }
    //     // create the session
    //     const stripeSession = await Stripe.checkout.sessions.create(payment);
    //     res.render('checkouts/checkout', {
    //         'sessionId': stripeSession.id,
    //         'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    //     })
    // cartItems is still an array of Bookshelf model instances
    for (let i of cartItems) {
        const lineItem = {
            'quantity': i.get('quantity'),
            'quantity': i.get('quantity'),
            'price_data': {
                'currency': 'SGD',
                'unit_amount': i.related('variant').get('cost'),
                'product_data': {
                    'name': i.related('variant').get('stock')
                }
            }
        }

        // check if the product has an image
        if (i.related('variant').get('image_url')) {
            lineItem.price_data.product_data.images = [i.related('variant').get('image_url')]
        }

        lineItems.push(lineItem);

        // record how many quantity has been purchased for this product id
        meta.push({
            'product_id': i.get('variant_id'),
            'quantity': i.get('quantity')
        })

    }

    // create the payment

    // change the meta array into a JSON string
    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ["card"],
        mode: 'payment',
        line_items: lineItems,
        success_url: "https://www.google.com/",
        cancel_url: "https://sg.yahoo.com/",
        metadata: {
            'orders': metaData
        }
    }

    // create the session
    const stripeSession = await Stripe.checkout.sessions.create(payment);
    res.render('checkouts/checkout', {
        'sessionId': stripeSession.id,
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })

})

module.exports = router;