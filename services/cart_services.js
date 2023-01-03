const cartDataLayer = require('../dal/cart_items');
const productDataLayer = require('../dal/product');


//GET ALL

async function getUserCart(userId) {
    return await cartDataLayer.getCart(userId);
}
//GET STOCK
async function checkStock(variantId)
{
    const variant = await productDataLayer.getVariantById(variantId);
    return parseInt(variant.get('stock'));
}


// //ADD THIS
async function addToCart(userId, variantId, quantity)
{
    const cartItem = await cartDataLayer.getCartItemByUserAndProduct(userId, variantId);
    console.log(userId)
    console.log(variantId)
    console.log(quantity)
    const stock = await checkStock(variantId);
    console.log(variantId)
    if(cartItem)
    {
        return await cartDataLayer.updateQuantity(userId, variantId, quantity, cartItem.get('quantity') + 1);
    }
    else{
        let newCart = cartDataLayer.createCartItem(userId,variantId,quantity);
        return newCart;
    }
}

//UPDATE CART
async function setQuantity(userId, variantId, quantity) {
    const stock = await checkStock(variantId)

    if(quantity > stock)
    {
        return false;
    }

    return await cartDataLayer
               .updateQuantity(userId, variantId, quantity);
}


//DELETE CART
async function deleteFromCart(userId, variantId)
{
    return await cartDataLayer.removeFromCart(userId, variantId)
}
module.exports = {getUserCart, setQuantity, checkStock, addToCart, deleteFromCart}