const Bookshelf = require('bookshelf');
const bookshelf = require('../bookshelf')

const Shoe = bookshelf.model('Shoe', {
    tableName:'shoes',
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
        return this.belongsTo('Shoe')
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
    }
 
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

module.exports = { Shoe, Brand, Gender, Variant, Color, Size, User, Role, Order, Status };