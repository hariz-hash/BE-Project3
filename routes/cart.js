const express = require("express");
const { getUserCart, addToCart, deleteFromCart, setQuantity } = require("../services/cart_services");
const { checkIfAuthenticated } = require("../middlewares");
const router = express.Router();

//READ
router.get('/',checkIfAuthenticated ,async function(req,res){
    // let cart = new CartServices(req.session.user.id);
    let cart = await getUserCart(req.session.user.id)
    return res.render('cart/index', {
        'cart': cart.toJSON()
    })
})
//CREATE
router.get('/:variant_id/add', checkIfAuthenticated,  async function(req,res){
    const userId = req.session.user.id;
    const variant_id = req.params.variant_id;

    await addToCart(userId, variant_id, 1);
    req.flash("success_messages", "The item has been added");
    res.redirect('/carts')
})
//Delete
router.get('/:variant_id/remove', checkIfAuthenticated, async (req,res)=> {
    const userId = req.session.user.id;
    const variantId = req.params.variant_id;

    await deleteFromCart(userId, variantId)

    req.flash("success_messages", 'Item has been removed');
    res.redirect('/carts');
})

router.post('/:variant_id/update', checkIfAuthenticated, async(req,res)=>{
    const userId = req.session.user.id;
    const updateQuantity = req.body.newQty;
    const variant_id = req.params.variant_id;

    await setQuantity(userId, variant_id, updateQuantity);
    req.flash('success_messages', "The quantity has been updated");
    res.redirect('/carts');
  })




module.exports = router;