const { CartItem } = require('../models');

const getCart = async (userId) => {
    return await CartItem.collection()
        .where({
            'user_id': userId
        }).fetch({
            require: false,
            withRelated: ['user', 'variant.shoe', 'variant.color', 'variant.size']// check this
        });
}

const getCartItemByUserAndProduct = async (userId, variantId) => {
    return await CartItem.where({
        'user_id': userId,
        'variant_id': variantId
    }).fetch({
        require: false
    });
}
async  function createCartItem (userId, variantId, quantity){
    const cartItem = new CartItem({
        'user_id': userId,
        'variant_id': variantId,
        'quantity': quantity
    })
    await cartItem.save();
    return cartItem;
}
async function removeFromCart(userId, productId) {
    let cartItem = await getCartItemByUserAndProduct(userId, productId);
    if (cartItem) {
        await cartItem.destroy();
        return true;
    }
    return false;
}
async function updateQuantity(userId, productId, newQuantity) {
    let cartItem = await getCartItemByUserAndProduct(userId, productId);
    if (cartItem) {
        cartItem.set('quantity', newQuantity);
        cartItem.save();
        return true;
    }
    return false;
}
module.exports =
{
    getCart,
    getCartItemByUserAndProduct,
    createCartItem,
    removeFromCart,
    updateQuantity
}
