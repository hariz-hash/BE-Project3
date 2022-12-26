const express = require("express");
const router = express.Router();

// #1 import in the Product model
const { bootstrapField, createProductForm } = require('../forms');
const {Shoe, Variant, User, Order, Brand, Gender, Material} = require('../models')

router.get('/', async (req,res)=>{
    // #2 - fetch all the products (ie, SELECT * from products)
    let shoes = await Shoe.collection().fetch({
        withRelated:['brand','gender']
    });
    let variant = await Variant.collection().fetch({
        withRelated:['color','size','shoe']
    });
    let user = await User.collection().fetch({
        withRelated:['role']
    });
    let order = await Order.collection().fetch({
        withRelated:['user','status']
    });
    // let order = await Order.collection().fetch({
    //     withRelated:['order']
    // });
    res.render('products/index', {
        'shoes': shoes.toJSON(),
        'variants': variant.toJSON(),
        'users': user.toJSON(),
        'orders': order.toJSON()

    })
})


router.get('/create', async (req,res)=>{
    const brands = await Brand.fetchAll().map((each)=>
    {
        return[each.get('id'), each.get('brand')]
    })
    const genders = await Gender.fetchAll().map((each)=>
    {
        return[each.get('id'), each.get('gender')]

    })
    const materials = await Material.fetchAll().map((each)=>
    {
        return[each.get('id'), each.get('materials')]

    })
    const productForm = createProductForm(brands,genders,materials);
    res.render('products/create',{
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create', async (req,res)=>
{
    const brands = await Brand.fetchAll().map((each)=>
    {
        return[each.get('id'), each.get('brand')]
    })
    const genders = await Gender.fetchAll().map((each)=>
    {
        return[each.get('id'), each.get('gender')]

    })
    const materials = await Material.fetchAll().map((each)=>
    {
        return[each.get('id'), each.get('materials')]

    })
    const productForm = createProductForm(brands,genders,materials);
    productForm.handle(req,{
        success: async (form)=>{
            let {materials,...productData} = form.data;
            const product = new Shoe();
            // product.set('model', form.data.model);
            // product.set('description', form.data.description);
            // product.set('shoe_type', form.data.shoe_type);
            await product.save(productData);
            if (materials) {
                await product.tags().attach(materials.split(","));
            }
            res.redirect('/products')
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})
module.exports = router ;