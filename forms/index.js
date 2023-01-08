// import in caolan forms
const forms = require("forms");
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

const createProductForm = (brands, genders, materials = []) => { // add materials
    return forms.create({
        'model': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(100)]
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(200)]
        }),
        'shoe_type': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(200)]
        }),
        'brand_id': fields.string({
            label: 'Brands',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: brands
        }),
        'gender_id': fields.string({
            label: 'Gender',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: genders
        }),
        'materials': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: materials
        }),

        'image_url': fields.string({
            required: validators.required('Image required'),
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.hidden()
        }),
        'thumbnail_url': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.hidden()
        })
    })
};

const createVariantForm = (colors, size) => //colors,shoeSize
{
    return forms.create({
        'cost': fields.number({
            label: 'Cost',
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'stock': fields.number({
            label: 'Stock',
            required: true,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'color_id': fields.string({
            label: 'Color',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: colors
        }),
        'size_id': fields.string({
            label: 'size',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: size
        }),
        'image_url': fields.url({
            required: validators.required('Image required'),
            errorAfterField: true,
            validators: [validators.url()],
            widget: forms.widgets.hidden()
        }),
        'thumbnail_url': fields.url({
            widget: forms.widgets.hidden()
        })
    })

};

const createRegistrationForm = () => {
    return forms.create({
        'username': fields.string({
            required: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(100)],
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(100)],
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(200)],
        }),
        'confirm_password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.matchField('password')]
        })
    })
}

const createLoginForm = () => {
    return forms.create({
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.email()]
        })

    })
}

const searchProductForm = (brands, genders, materials = []) => { // add materials
    return forms.create({
        'model': fields.string({
            required: false,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'shoe_type': fields.string({
            required: false,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'brand_id': fields.string({
            label: 'Brands',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: brands
        }),
        'gender_id': fields.string({
            label: 'Gender',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: genders
        }),
        'materials': fields.string({
            required: false,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: materials
        }),

    })
};

const searchOrderForm = (status) => {
    return forms.create({

        'min_cost': fields.number({
            label: 'min cost',
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'max_cost': fields.number({
            label: 'max cost',
            required: false,
            errorAfterField: true,
            validators: [validators.integer(), validators.min(0)]
        }),
        'shipping_postal_code': fields.string({
            label: 'Postal Code',
            required: false,
            errorAfterField: true,
            validators: [validators.maxlength(20)]

        }),
        'order_status_id': fields.number({
            label: 'Order status',
            required: true,
            errorAfterField: true,
            choices: status,
            widget: widgets.select()
        })

    })
}

const updateStatusForm = (status) => {
    return forms.create({
        'order_status_id': fields.string({
            label: 'Order status',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: status,
        })
    })
}


module.exports = { createProductForm, bootstrapField, createVariantForm, createRegistrationForm, createLoginForm, searchProductForm, updateStatusForm, searchOrderForm };