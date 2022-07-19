'use strict'

const Category = require('../models/category.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const bcrypt = require('bcrypt-nodejs');


exports.validateData = (data)=>{
    let keys = Object.keys(data), msg = '';

    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
            msg +=  `The param ${key} is required \n` ; 
    }
    return msg.trim();

}


exports.searchUser = async (username)=>{
    try{
        let exist = User.findOne({username: username}).lean()
        return exist;    

    }catch(err){
        console.log(err);
        return err; 
    }
}


exports.encrypt = async (password)=>{
    try{
        return bcrypt.hashSync(password); 
    }catch(err){
        console.log(err);
        return err; 
    }
}



exports.checkPass = async (password, hash)=>{
    try{
        return bcrypt.compareSync(password, hash); 
    }catch(err){
        console.log(err);
        return err;
    }
}


exports.checkPermission = async (userID, sub)=>{
    try{
        if(userID != sub) return false; 
        else return true; 

    }catch(err){
        console.log(err);
        return err; 
    }
}



exports.checkUpdated = async (user)=>{
    try{
        if(user.password || Object.entries(user).length === 0 || user.role ){
            return false;
        }else{
            return true; 
        }
    }catch(err){
        console.log(err); 
        return err; 
    }
}






exports.searchCategory = async(name)=>{
    try {
        let exist = Category.findOne({name: name}).lean()
        return exist;
    } catch (err) {
        console.log(err);
        return err;
    }
}


exports.searchProduct = async (name)=>{
    try{
       let exist = Product.findOne({name: name}).lean() 
        return exist;

    }catch(err){
        console.log(err);
        return err;
    }
}


