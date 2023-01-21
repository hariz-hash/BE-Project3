const express = require('express')
const router = express.Router();
const productDataLayer = require('../../dal/product')
const { getUserCart, addToCart, deleteFromCart, setQuantity } = require("../../services/cart_services");
const { checkIfAuthenticatedJWT } = require('../../middlewares')

//RETRIEVE user items from CARTS;

router.get('/', checkIfAuthenticatedJWT, async (req, res) => {

    // extract jwt information
    const user = req.user;
    console.log(user);
    
    console.log(user.id)
    //  res.send(await productDataLayer.getAllProducts())
    const cartItems = await getUserCart(user.id)
    console.log("test")
    res.send({cartItems: cartItems})
})

router.post('/:variant_id/add', checkIfAuthenticatedJWT, async (req, res) => {
    // const testAccountId = 12;
    const user = req.user;

    const variant_id = req.params.variant_id;
    const quantity = req.body.quantity;

    let add = await addToCart(user.id, variant_id, 1);
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
    const user = req.user;
    const updateQuantity = req.body.quantity;
    const variant_id = req.params.variant_id;
    // console.log(user.id, variant_id, updateQuantity)
    console.log(req)

    let update = await setQuantity(user.id, variant_id, updateQuantity);
    if (update) {
        res.json({ "yes": "Success" })
        console.log(update)
        
    }
    else {
        res.json({ 'error': "item has reached it's limit" })
    }
  })

// router.get('/', checkIfAuthenticatedJWT,  async(req,res)=>{
//     res.send(await productDataLayer.getAllProducts())
// })

router.delete('/:variant_id/remove', checkIfAuthenticatedJWT, async (req, res) => {
    const user = req.user;
    const variantId = req.params.variant_id;
    let deleteItemFromCart = await deleteFromCart(user.id, variantId)
    if (deleteItemFromCart) {
        res.json({ "yes": "Success" })
    }
    else {
        res.json({ 'error': "item has been removed" })
    }
})
module.exports = router