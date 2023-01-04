const express = require("express");
const router = express.Router();
const { checkIfAuthenticated } = require('../middlewares');
// #1 import in the Product model
const { bootstrapField, createProductForm, createVariantForm, searchProductForm } = require('../forms');
const { Shoe, Variant, User, Order, Brand, Gender, Material, Color, Size } = require('../models')
const datalayer = require('../dal/product');

router.get('/', checkIfAuthenticated, async (req, res) => {
    // #2 - fetch all the products (ie, SELECT * from products)
    let shoes = await Shoe.collection().fetch({
        withRelated: ['brand', 'gender', 'materials']
    });

    // console.log(shoes.toJSON());
    let variant = await Variant.collection().fetch({
        withRelated: ['color', 'size', 'shoe']
    });
    const allBrands = await datalayer.getAllBrands();
    allBrands.unshift([0, '--- Any Brand ---']);
    const allGender = await datalayer.getAllGenders();
    allGender.unshift([0, '--- Any Brand ---']);
    const allMaterials = await datalayer.getAllMaterials();

    let searchForm = searchProductForm(allBrands, allGender, allMaterials);
    let q = Shoe.collection()

    console.log({ searchForm })
    searchForm.handle(req, {
        'empty': async (form) => {
            let shoes = await q.fetch({
                withRelated: ['brand', 'gender', 'materials']
            })
            res.render('products/index', {
                'shoes': shoes.toJSON(),
                'form': searchForm.toHTML(bootstrapField)
            })
        },
        'error': async (form) => {
            let shoes = await q.fetch({
                withRelated: ['brand', 'gender', 'materials']
            })
            res.render('products/index', {
                'shoes': shoes.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
        'success': async (form) => {
            if (form.data.model) {
                q.where('model', 'like', '%' + form.data.model + '%')
            }
            if (form.data.shoe_type) {
                q.where('shoe_type', 'like', '%' + form.data.shoe_type + '%')
            }
            if (form.data.brand_id && form.data.brand_id !== "0") {
                q.where('brand_id', '=', form.data.brand_id)
            }
            if (form.data.gender_id && form.data.gender_id !== "0") {
                q.where('gender_id', '=', form.data.gender_id)
            }
            if (form.data.materials) {
                // ...JOIN products_tags ON products.id = products_tags.product_id
                q.query('join', 'materials_shoes', 'shoes.id', 'shoe_id')
                    .where('material_id', 'in', form.data.materials.split(','))
            }
            
            const products = await q.fetch({
                withRelated:['gender', 'brand', 'materials'] // for each product, load in each of the tag
            });
            res.render('products/index', {
                'shoes': products.toJSON(),
                'form': form.toHTML(bootstrapField)
            })

        }
    })

    // res.render('products/index', {
    //     'shoes': shoes.toJSON(),
    //     'variants': variant.toJSON(),
    //     'form': searchForm.toHTML(bootstrapField),

    // })
})
router.get('/create', checkIfAuthenticated, async (req, res) => {
    const brands = await Brand.fetchAll().map((each) => {
        return [each.get('id'), each.get('brand')]
    })
    const genders = await Gender.fetchAll().map((each) => {
        return [each.get('id'), each.get('gender')]

    })
    const materials = await Material.fetchAll().map((each) => {
        return [each.get('id'), each.get('materials')]

    })
    const productForm = createProductForm(brands, genders, materials);
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_UPLOAD_PRESET
    })
})
router.post('/create', checkIfAuthenticated, async (req, res) => {
    const brands = await Brand.fetchAll().map((each) => {
        return [each.get('id'), each.get('brand')]
    })
    const genders = await Gender.fetchAll().map((each) => {
        return [each.get('id'), each.get('gender')]

    })
    const materials = await Material.fetchAll().map((each) => {
        return [each.get('id'), each.get('materials')]
    })

    const productForm = createProductForm(brands, genders, materials);
    productForm.handle(req, {
        success: async (form) => {
            let { materials, ...productData } = form.data;
            const product = new Shoe();
            console.log(materials)
            await product.save(productData);
            if (materials) {
                await product.materials().attach(materials.split(","));
                console.log(materials.split(","))
            }
            req.flash("success_messages", `New Product ${product.get('model')} has been created`)
            res.redirect('/products')//where does this url comes from 
        },
        'empty': async function (form) {
            // executed if the user just submit without any input
            res.render('products/create', {
                'form': form.toHTML(bootstrapField),
                "cloudinaryName": process.env.CLOUDINARY_NAME,
                "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
                "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField),
                "cloudinaryName": process.env.CLOUDINARY_NAME,
                "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
                "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})
router.get('/:product_id/update', checkIfAuthenticated, async (req, res) => {
    // retrieve the product
    const brands = await Brand.fetchAll().map((each) => {
        return [each.get('id'), each.get('brand')]
    })
    const genders = await Gender.fetchAll().map((each) => {
        return [each.get('id'), each.get('gender')]

    })
    const materials = await Material.fetchAll().map((each) => {
        return [each.get('id'), each.get('materials')]

    })
    const productId = req.params.product_id
    const product = await Shoe.where({
        'id': productId
    }).fetch({
        require: true,
        withRelated: ['materials']
    });
    console.log(productId)
    const productForm = createProductForm(brands, genders, materials);

    // // fill in the existing values
    productForm.fields.model.value = product.get('model');
    productForm.fields.description.value = product.get('description');
    productForm.fields.shoe_type.value = product.get('shoe_type');
    productForm.fields.brand_id.value = product.get('brand_id');
    productForm.fields.gender_id.value = product.get('gender_id');
    productForm.fields.image_url.value = product.get('image_url');
    productForm.fields.thumbnail_url.value = product.get('thumbnail_url');
    let selectedMaterials = await product.related('materials').pluck('id');
    productForm.fields.materials.value = selectedMaterials;

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON(),
        "cloudinaryName": process.env.CLOUDINARY_NAME,
        "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
        "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET
    })
})
router.post('/:product_id/update', checkIfAuthenticated, async (req, res) => {
    // fetch the product that we want to update
    const brands = await Brand.fetchAll().map((each) => {
        return [each.get('id'), each.get('brand')]
    })
    const genders = await Gender.fetchAll().map((each) => {
        return [each.get('id'), each.get('gender')]

    })
    const materials = await Material.fetchAll().map((each) => {
        return [each.get('id'), each.get('materials')]
    })

    const productId = req.params.product_id;
    const product = await Shoe.where({
        'id': productId
    }).fetch({
        require: true,
        withRelated: ['materials']
    });

    // process the form
    const productForm = createProductForm(brands, genders, materials);
    productForm.handle(req, {
        'success': async (form) => {
            let { materials, ...productData } = form.data;
            product.set(productData);
            product.save();
            //update tags
            let materialIds = materials.split(',')
            let existingMaterialIds = await product.related('materials').pluck('id');

            //Remove all the materials that aren't selected anyomre
            let toRemove = existingMaterialIds.filter(id => materialIds.includes(id) === false);
            await product.materials().detach(toRemove);
            await product.materials().attach(materialIds);

            res.redirect('/products');
        }, 'empty': async function (form) {
            // executed if the user just submit without any input
            res.render('products/create', {
                'form': form.toHTML(bootstrapField),
                "cloudinaryName": process.env.CLOUDINARY_NAME,
                "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
                "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField),
                "cloudinaryName": process.env.CLOUDINARY_NAME,
                "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
                "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})
router.get('/:product_id/delete', checkIfAuthenticated, async (req, res) => {
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
router.post('/:product_id/delete', checkIfAuthenticated, async (req, res) => {
    // fetch the product that we want to delete
    const product = await Shoe.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });
    await product.destroy();
    res.redirect('/products')
})
router.get('/:product_id/variants', checkIfAuthenticated, async (req, res) => {

    const productId = req.params.product_id;

    let shoe = await Shoe.where({
        "id": productId
    }).fetch(
        {
            withRelated: ['brand', 'gender', 'materials']
        }
    )
    console.log(shoe);
    let variantDisplay = await Variant.where({
        'shoe_id': productId
    }).fetchAll(
        {
            require: false,
            withRelated: ['color', 'size']
        }
    )

    res.render('products/variants', {
        'shoes': shoe.toJSON(),
        'variants': variantDisplay.toJSON(),
    })
})
router.get('/:product_id/variants/create', checkIfAuthenticated, async (req, res) => {
    const color = await Color.fetchAll().map((each) => {
        return [each.get('id'), each.get('color')]
    })
    const size = await Size.fetchAll().map((each) => {
        return [each.get('id'), each.get('size')]
    })

    const productForm = createVariantForm(color, size)
    console.log({ productForm })
    res.render('products/create-variant', {
        'form': productForm.toHTML(bootstrapField),
        'cloudinaryName': process.env.CLOUDINARY_NAME,
        'cloudinaryApiKey': process.env.CLOUDINARY_API_KEY,
        'cloudinaryPreset': process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:product_id/variants/create', checkIfAuthenticated, async (req, res) => {
    const color = await Color.fetchAll().map((each) => {
        return [each.get('id'), each.get('color')]
    })
    const size = await Size.fetchAll().map((each) => {
        return [each.get('id'), each.get('size')]
    })

    // let shoe = await Shoe.where({
    //     "id": productId
    // }).fetch(
    //     {
    //         withRelated:['brand','gender','materials']
    //     }
    // )
    //     console.log(shoe);
    // let variantDisplay = await Variant.where({
    //     'shoe_id':productId
    // }).fetchAll(
    //     {
    //         require: false,
    //         withRelated:['color','size']
    //     }
    // )
    const productId = req.params.product_id;

    const productForm = createVariantForm(color, size)
    productForm.handle(req, {
        success: async (form) => {
            const dataIn = { ...form.data };
            console.log({ dataIn })
            const variantData = {
                shoe_id: req.params.product_id,
                ...form.data
            };
            console.log({ variantData })
            const variant = new Variant();
            await variant.save(variantData);

            req.flash("success_messages", `New variant  has been added`)
            // res.redirect('/products')//where does this url comes from 
            res.redirect(`/products/${req.params.product_id}/variants`);

        }, 'empty': async function (form) {
            // executed if the user just submit without any input
            res.render('products/create', {
                'form': form.toHTML(bootstrapField),
                "cloudinaryName": process.env.CLOUDINARY_NAME,
                "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
                "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField),
                "cloudinaryName": process.env.CLOUDINARY_NAME,
                "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
                "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})

router.get('/:product_id/variants/:variant_id/update', checkIfAuthenticated, async (req, res) => {
    const color = await Color.fetchAll().map((each) => {
        return [each.get('id'), each.get('color')]
    })
    const size = await Size.fetchAll().map((each) => {
        return [each.get('id'), each.get('size')]
    })

    let variantDisplay = await Variant.where({
        'id': req.params.variant_id
    }).fetch(
        {
            require: false,
            withRelated: ['color', 'size']
        }
    )
    const variantForm = createVariantForm(color, size);
    variantForm.fields.cost.value = variantDisplay.get('cost');
    variantForm.fields.stock.value = variantDisplay.get('stock');
    variantForm.fields.color_id.value = variantDisplay.get('color_id');
    variantForm.fields.size_id.value = variantDisplay.get('size_id');
    variantForm.fields.image_url.value = variantDisplay.get('image_url');
    variantForm.fields.thumbnail_url.value = variantDisplay.get('thumbnail_url');
    res.render('products/update-variant', {
        'variant': variantDisplay.toJSON(),
        'form': variantForm.toHTML(bootstrapField),
        "cloudinaryName": process.env.CLOUDINARY_NAME,
        "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
        "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET
    });

})

router.post('/:product_id/variants/:variant_id/update', checkIfAuthenticated, async (req, res) => {
    const color = await Color.fetchAll().map((each) => {
        return [each.get('id'), each.get('color')]
    })
    const size = await Size.fetchAll().map((each) => {
        return [each.get('id'), each.get('size')]
    })
    let variantDisplay = await Variant.where({
        'id': req.params.variant_id
    }).fetch(
        {
            require: false,
            withRelated: ['color', 'size']
        }
    )
    const variantForm = createVariantForm(color, size);
    variantForm.handle(req, {
        success: async (form) => {
            const variantData = {
                ...form.data,
                shoe_id: req.params.product_id
            };

            // const variant = new Variant();
            variantDisplay.set(variantData)
            await variantDisplay.save();

            req.flash("success_messages", `New variant  has been added`)
            res.redirect(`/products/${req.params.product_id}/variants`);
        },
        'empty': async function (form) {
            // executed if the user just submit without any input
            res.render('products/create', {
                'form': form.toHTML(bootstrapField),
                "cloudinaryName": process.env.CLOUDINARY_NAME,
                "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
                "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField),
                "cloudinaryName": process.env.CLOUDINARY_NAME,
                "cloudinaryApiKey": process.env.CLOUDINARY_API_KEY,
                "cloudinaryPreset": process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})


router.get('/:product_id/variants/:variant_id/delete', checkIfAuthenticated, async (req, res) => {
    let shoe = await Shoe.where({
        "id": req.params.product_id
    }).fetch(
        {
            withRelated: ['brand', 'gender', 'materials']
        }
    )
    let variantDisplay = await Variant.where({
        'id': req.params.variant_id
    }).fetchAll(
        {
            withRelated: ['color', 'size']
        }
    )
    res.render('products/delete-variant', {
        'variant': variantDisplay.toJSON(),
        'shoes': shoe.toJSON()
    })
})
router.post('/:product_id/variants/:variant_id/delete', checkIfAuthenticated, async (req, res) => {

    let variantDisplay = await Variant.where({
        'id': req.params.variant_id
    }).fetch(
        {
            require: false,
            withRelated: ['color', 'size']
        }
    )
    await variantDisplay.destroy()
    res.redirect(`/products/${req.params.product_id}/variants`);


})

module.exports = router;