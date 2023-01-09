const express = require('express');
const { User } = require('../models');

async function addNewUser(newuserAccount,roleId)
{
    const newUser = new User();
    newuserAccount.role_Id = roleId
    newUser.set(newuserAccount)
    await newUser.save();
    
    return newUser
    
}

module.exports = {addNewUser}