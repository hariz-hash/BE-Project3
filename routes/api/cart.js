const express = require('express')
const router = express.Router();
const productDataLayer = require('../../dal/product')
const { getUserCart, addToCart, deleteFromCart, setQuantity } = require("../../services/cart_services");
const { checkIfAuthenticatedJWT } = require('../../middlewares')

//RETRIEVE user items from CARTS;

router.get('/', checkIfAuthenticatedJWT, async (req, res) => {
    const testAccountId = 12;
    const user = req.user;
    //  res.send(await productDataLayer.getAllProducts())
    const cartItems = await getUserCart(testAccountId)
    console.log("test")
    res.json(cartItems)
})
router.post('/:variant_id/add', checkIfAuthenticatedJWT, async (req, res) => {
    const testAccountId = 12;
    const variant_id = req.params.variant_id;
    const quantity = req.body.quantity;

    let add = await addToCart(testAccountId, variant_id, quantity);
    // res.send(test)
    if (add) {
        res.json({ "yes": "Success" })
    }
    else {
        res.json({ 'error': "cannot add" })
    }
    // const variant = await productDataLayer.getVariantByIdwithProduct(req.params.product_id)
    // res.send(variant);
})

router.put('/:variant_id/update', checkIfAuthenticatedJWT, async(req,res)=>{
    const testAccountId = 12;
    const updateQuantity = req.body.newQty;
    const variant_id = req.params.variant_id;

    let update = await setQuantity(testAccountId, variant_id, updateQuantity);
    if (update) {
        res.json({ "yes": "Success" })
    }
    else {
        res.json({ 'error': "cannot add" })
    }
  })

router.get('/', checkIfAuthenticatedJWT,  async(req,res)=>{
    res.send(await productDataLayer.getAllProducts())
})

router.delete('/:variant_id/remove', checkIfAuthenticatedJWT, async (req, res) => {
    const testAccountId = 12;
    const variantId = req.params.variant_id;

    let deleteItemFromCart = await deleteFromCart(testAccountId, variantId)
    
    if (deleteItemFromCart) {
        res.json({ "yes": "Success" })
    }
    else {
        res.json({ 'error': "cannot add" })
    }
 
})
module.exports = router