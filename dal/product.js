const express = require("express");
const { Shoe, Variant, Brand, Gender, Material, Color, Size } = require('../models')

//getall brand,gender,Material,color,size

async function getAllBrands() {
    const allBrands = await Brand.fetchAll().map( each => {
        return [each.get("id"), each.get("brand")];
    })
    return allBrands;
}

async function getAllGenders() {
    const allGenders = await Gender.fetchAll().map( each => {
        return [each.get("id"), each.get("gender")];
    })
    return allGenders;
}

async function getAllMaterials() {
    const allMaterial = await Material.fetchAll().map( each => {
        return [each.get("id"), each.get("materials")];
    })
    return allMaterial;
}
async function getAllColors() {
    const allColors = await Color.fetchAll().map( each => {
        return [each.get("id"), each.get("color")];
    })
    return allColors;
}
async function getAllSize() {
    const allSize = await Size.fetchAll().map( each => {
        return [each.get("id"), each.get("size")];
    })
    return allSize;
}

async function getVariantByIdwithProduct(productId) {
    const variant = await Variant.where({
        'shoe_id': productId
    }).fetchAll(
        {
            require: false,
            withRelated: ['color', 'size']
        }
    )
    return variant;
}

async function getVariantById(productId) {
    const variant = await Variant.where({
        'id': productId
    }).fetchAll(
        {
            require: false,
            withRelated: ['color', 'size']
        }
    )
    return variant;
}


async function getProductById(productId) {
    const product = await Shoe.where({
        "id": productId
    }).fetch(
        {
            withRelated: ['brand', 'gender', 'materials']
        }
    )
    return product;
}

module.exports =
{
    getAllBrands, 
    getAllGenders, 
    getAllColors, 
    getAllSize, 
    getProductById, 
    getVariantById, 
    getAllMaterials,
    getVariantByIdwithProduct
}