const express = require('express')
const router = express.Router();
const productDataLayer = require('../../dal/product')

router.get('/', async(req,res)=>{
    res.send(await productDataLayer.getAllProducts())
})

// router.get('/:product_id/variants', async(req,res)=>
// {
//     const variant = await productDataLayer.getVariantByIdwithProduct(req.params.product_id)
//     res.send(variant);
// })
module.exports = router