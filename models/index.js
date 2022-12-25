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
    }
})
module.exports = { Shoe, Brand, Gender, Variant, Color, Size };