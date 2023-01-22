const express = require('express');
const { User } = require('../models');

async function addNewUser(newuserAccount, roleId) {
    const newUser = new User();
    newuserAccount.role_Id = roleId
    newUser.set(newuserAccount)

    const checkEmail = await User.where({
        "email": newuserAccount.email
    }).fetch(
        {
            require: false,
            withRelated: ['role', 'order','cartItems']
        }
    )

    if(checkEmail)
    {
        return false;
    }
    else{
        await newUser.save();
        return true
        
    }
  



    


    // const variant = await Variant.where({
    //     'shoe_id': productId
    // }).fetchAll(
    //     {
    //         require: false,
    //         withRelated: ['color', 'size']
    //     }
    // )

}

module.exports = { addNewUser }