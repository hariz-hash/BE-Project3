const express = require("express");
const router = express.Router();

// #1 import in the Product model
const {Shoe, Variant} = require('../models')

router.get('/', async (req,res)=>{
    // #2 - fetch all the products (ie, SELECT * from products)
    let shoes = await Shoe.collection().fetch({
        withRelated:['brand','gender']
    });
    let variant = await Variant.collection().fetch({
        withRelated:['color','size']
    });
    res.render('products/index', {
        'shoes': shoes.toJSON(),
        'variants': variant.toJSON()
    })
})

module.exports = router ;