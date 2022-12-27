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
    // let variant = await Variant.collection().fetch({
    //     withRelated:['color','size','shoe']
    // });
    // let user = await User.collection().fetch({
    //     withRelated:['role']
    // });
    // let order = await Order.collection().fetch({
    //     withRelated:['user','status']
    // });
    // let order = await Order.collection().fetch({
    //     withRelated:['order']
    // });
    res.render('products/index', {
        'shoes': shoes.toJSON(),
        // 'variants': variant.toJSON(),
        // 'users': user.toJSON(),
        // 'orders': order.toJSON()

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
            console.log(materials)
            // product.set('model', form.data.model);
            // product.set('description', form.data.description);
            // product.set('shoe_type', form.data.shoe_type);
            await product.save(productData);
            if (materials) {
                await product.materials().attach(materials.split(","));
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

router.get('/:product_id/update', async (req, res) => {
    // retrieve the product
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
    const productId = req.params.product_id
    const product = await Shoe.where({
        'id': productId
    }).fetch({
        require: true
    });
    console.log(productId)
    const productForm = createProductForm(brands,genders);
    


    // // fill in the existing values
    productForm.fields.model.value = product.get('model');
    productForm.fields.description.value = product.get('description');
    productForm.fields.shoe_type.value = product.get('shoe_type');
    productForm.fields.brand_id.value = product.get('brand_id');
    productForm.fields.gender_id.value = product.get('gender_id');
    

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })
})

router.post('/:product_id/update', async (req, res) => {

    // fetch the product that we want to update
    const product = await Shoe.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });

    // process the form
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            product.set(form.data);
            product.save();
            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': product.toJSON()
            })
        }
    })
})
router.get('/:product_id/delete', async(req,res)=>{
    // fetch the product that we want to delete
    const product = await Shoe.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });

    res.render('products/delete', {
        'product': product.toJSON()
    })
});
router.post('/:product_id/delete', async(req,res)=>{
    // fetch the product that we want to delete
    const product = await Shoe.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });
    await product.destroy();
    res.redirect('/products')
})

// router.get('/:product_id/delete', async(req,res)=>{
//     // fetch the product that we want to delete
//     const product = await Product.where({
//         'id': req.params.product_id
//     }).fetch({
//         require: true
//     });

//     res.render('products/delete', {
//         'product': product.toJSON()
//     })

// });


module.exports = router ;