const Bookshelf = require('bookshelf');
const bookshelf = require('../bookshelf')

const Shoe = bookshelf.model('Shoe', {
    tableName:'shoes',
    idAttribute: 'id',
    brand()
    {
        return this.belongsTo('Brand')    
    },
    gender()
    {
        return this.belongsTo('Gender')
    },
    variants()
    {
        return this.hasMany('Variant')
    },// issue here
    //many to many  on material_shoes with material
    materials()
    {
        return this.belongsToMany('Material', "materials_shoes", "shoe_id");
    }
});

const Material = bookshelf.model('Material', {
    tableName:'materials',
    shoes()
    {
        return this.belongsToMany('Shoe','materials_shoes', 'material_id');
    }
});

const Brand = bookshelf.model('Brand',{
    tableName:"brands",
    shoes()
    {
        return this.hasMany('Shoe')
    }
}
);

const Gender = bookshelf.model("Gender",{
    tableName:"genders",
    shoes()
    {
        return this.hasMany('Shoe')
    }
})

const Variant = bookshelf.model("Variant",{
    tableName:"variants",
    color()
    {
        return this.belongsTo('Color')
    },
    size()
    {
        return this.belongsTo('Size')
    },
    shoe()
    {
        return this.belongsTo('Shoe','shoe_id')
    },
    users()
    {
        return this.belongsToMany('User');//many to many
    },
    orders()
    {
        return this.belongsToMany('Order');//many to many
    },
    cartItems()
    {
        return this.hasMany('CartItem');
    }
})

const Color = bookshelf.model("Color",{
    tableName:"colors",
    variants()
    {
        return this.hasMany('Variant')
    }
})
const Size = bookshelf.model("Size",{
    tableName:"sizes",
    variants()
    {
        return this.hasMany('Variant')
    },
 
})

const User = bookshelf.model("User",{
    tableName:"users",
    role()
    {
        return this.belongsTo('Role')
    },
    order()
    {
        return this.hasMany('Order')

    },
    variants()
    {
        return this.belongsToMany('Variant');//many to many
    },
    cartItems()
    {
        return this.hasMany('CartItem');
    }
    
})
const Order = bookshelf.model("Order",{
    tableName:"orders",
    user()
    {
        return this.belongsTo('User')
    },
    status()
    {
        return this.belongsTo('Status')
    },
    variants()
    {
        return this.belongsToMany('Variant');//many to many
    }
   // relationship with order_items with variants
   //many to many
})
const Status = bookshelf.model("Status",{
    tableName:"order_statuses",
    order()
    {
        return this.hasMany('Order')
    }
})

const Role = bookshelf.model("Role",{
    tableName:"roles",
    user()
    {
        return this.hasMany('User')
    },
})

const CartItem = bookshelf.model("CartItem",
{
    tableName: 'cart_items',
    user()
    {
        return this.belongsTo('User')
    },
    variant()
    {
        return this.belongsTo('Variant')
    }
})

module.exports = { Shoe, Brand, Gender, Variant, Color, Size, User, Role, Order, Status, Material, CartItem };