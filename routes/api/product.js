const express = require('express')
const router = express.Router();
const productDataLayer = require('../../dal/product')
const {checkIfAuthenticatedJWT} = require('../../middlewares')

// 1) protect a route with jwt
// - this route cannot be called/won't return any results if the request doesn't have a jwt
// 2) Test the protected route with a valid jwt
// - login first -> get the jwt token
// - make a request with the valid jwt token to the protected route

router.get('/',checkIfAuthenticatedJWT, async(req,res)=>{
    res.send(await productDataLayer.getAllProducts())
})

router.get('/:product_id/variants',checkIfAuthenticatedJWT, async(req,res)=>
{
    const variant = await productDataLayer.getVariantByIdwithProduct(req.params.product_id)
    res.send(variant);
})

module.exports = router

//ADD SEARCH POSTA