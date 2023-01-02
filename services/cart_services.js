const cartDataLayer = require('../dal/cart_items');
const productDataLayer = require('../dal/product');

// class CartServices {
//     constructor(user_id) {
//         this.user_id = user_id;
//     }

//     // async function removeFromCart(userId, productId) {
//     //     let cartItem = await getCartItemByUserAndProduct(userId, productId);
//     //     if (cartItem) {
//     //         await cartItem.destroy();
//     //         return true;
//     //     }
//     //     return false;
//     // }
//     // async getStock(variantId)
//     // {
//     //     let variantId = await productDataLayer.get
        
//     //     return await productDataLayer.getStock()
//     // }
//     // async getCurrentStock (variantId) {
//     //     const variant = await productDataLayer.getVariantById(variantId);
//     //     return parseInt(variant.get('stock'));
//     //   };
//     //Update 
//     async setQuantity(productId, quantity) {
//         return await cartDataLayer
//             .updateQuantity(this.user_id, productId, quantity);
//     }

//     //Delete by id
//     async removeItemFromCart(productId) {
//         return await cartDataLayer
//             .removeFromCart(this.user_id, productId);
//     }
//     //Read all
//     async getCart() {
//         return await cartDataLayer.getCart(this.user_id);
//     }

// }


// // async function getUserCart(userId) {
// //     return await productDataLayer.getCart(userId);
// // }

async function getUserCart(userId) {
    return await cartDataLayer.getCart(userId);
}

async function setQuantity(productId, quantity) {
    return await cartDataLayer
               .updateQuantity(this.user_id, productId, quantity);
}
module.exports = {getUserCart, setQuantity}