const express = require('express')
const router = express.Router();
const productDataLayer = require('../../dal/product')
const { checkIfAuthenticatedJWT } = require('../../middlewares')

// 1) protect a route with jwt
// - this route cannot be called/won't return any results if the request doesn't have a jwt
// 2) Test the protected route with a valid jwt
// - login first -> get the jwt token
// - make a request with the valid jwt token to the protected route

router.get('/', async (req, res) => {

    // const queryFields = req.query;
    let result = await productDataLayer.getAllProducts();
    res.send(result)
    // res.send(await productDataLayer.getAllProducts())
})

router.get('/search', async (req, res) => {

    const queryFields = req.query;
    const shoes = await productDataLayer.searchShoes(queryFields)
    res.send({ shoes })
})

router.get('/:product_id', async (req, res) => {
    const shoeCall = await productDataLayer.getProductById(req.params.product_id)
    // console.log(shoeCall.model)
    res.send({shoeCall});
    // console.log(shoeCall)
})

router.get('/:product_id/shoeDetails', async (req, res) => {
    const variant = await productDataLayer.getVariantByIdwithProduct(req.params.product_id)
    res.send({variant}); 
})// shoe id

router.get('/:product_id/variants', async (req, res) => {
    const onlyVariant = await productDataLayer.getVariantById(req.params.product_id)
    // console.log(onlyVariant)
    res.json({onlyVariant});
})

router.get('/search_options', async function (req, res) {
    // const allBrands = await productDataLayer.getAllBrands();
    // allBrands.unshift([0, '--- Any Brand ---']);

    const allGender = await productDataLayer.getAllGenders();
    allGender.unshift([0, '--- Any Gender ---']);

    // const allMaterials = await productDataLayer.getAllMaterials();
    // allMaterials.unshift([0, '--- Any Materials ---']);

    const options = {
        allBrands,
        allGender,
        // allMaterials
    }

    res.send({ options })

}
)
module.exports = router

// LEFT WITH A POST

