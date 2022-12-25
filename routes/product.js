const express = require("express");
const router = express.Router();

// #1 import in the Product model
const {Shoe, Variant, User, Order} = require('../models')

router.get('/', async (req,res)=>{
    // #2 - fetch all the products (ie, SELECT * from products)
    let shoes = await Shoe.collection().fetch({
        withRelated:['brand','gender']
    });
    let variant = await Variant.collection().fetch({
        withRelated:['color','size','shoe']
    });
    let user = await User.collection().fetch({
        withRelated:['role']
    });
    let order = await Order.collection().fetch({
        withRelated:['user','status']
    });
    // let order = await Order.collection().fetch({
    //     withRelated:['order']
    // });
    res.render('products/index', {
        'shoes': shoes.toJSON(),
        'variants': variant.toJSON(),
        'users': user.toJSON(),
        'orders': order.toJSON()

    })
})

module.exports = router ;