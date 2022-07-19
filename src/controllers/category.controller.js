'use strict'

const Product = require('../models/product.model');
const Category = require('../models/category.model');
const { validateData, checkUpdated} = require('../utils/validate');

exports.testCategory = (req, res)=>{
    return res.send({message: 'Function testCategory is running'}); 
}


exports.saveCategory = async (req, res)=>{
    try{
        const params = req.body; 
        const data = {
            name: params.name,
            description: params.description
        };

        const msg = validateData(data);
        if(!msg){
            const existCategory = await Category.findOne({name: params.name});
            if(!existCategory){
                const category = new Category(data);
                await category.save();
                return res.send({message: 'Category saved'});
            }else return res.send({message: 'Category already exist'});
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err); 
        return err; 
    }

}



exports.getCategorys = async (req, res)=>{
    try{
        const categorys = await Category.find();
        return res.send({message: 'Categorys:', categorys})
    }catch(err){
        console.log(err); 
        return err; 
    }
}



exports.getCategorys = async (req, res)=>{
    try{
        const categorys = await Category.find();
        return res.send({message: 'Categorys:', categorys})
    }catch(err){
        console.log(err); 
        return err; 
    }
}




exports.updateCategory = async (req, res)=>{
    try{
        const params = req.body;
        const categoryID = req.params.id; 
        const check = await checkUpdated(params);
        if(check === false) return res.status(400).send({message: 'Data not recived'});
        const msg = validateData(params);
        if(!msg){
            const alreadyCategory = await Category.findOne({name: params.name});
            if(!alreadyCategory){
                const updateCategory = await Category.findOneAndUpdate({_id: categoryID}, params, {new: true});
                return res.send({message: 'Update Category', updateCategory});
            }else return res.send({message: 'Category name already exists'});
        }else return res.status(400).send({message: 'Some parameter is empty'})
        }catch(err){
        console.log(err);
        return err; 
    }
}





exports.deleteCategory = async (req, res)=>{
    try{
        const categoryID = req.params.id;
        const categoryExist = await Category.findOne({_id: categoryID});
        if(!categoryExist) return res.status(500).send({message: 'Category not found or already delete.'});     
        if(categoryExist.category === 'Default')
            return res.send({message: 'Default category cannot be deleted.'});
        const newCategory = await Category.findOne({name:'Default'}).lean();
        const productExist = await Product.find({category: categoryID}); 

        for(let productUp of productExist){
            const updateNewCategory = await Product.findOneAndUpdate({_id: productUp._id},{category:newCategory._id});
        } 
        const categoryDeleted = await Category.findOneAndDelete({_id: categoryID});
        return res.send({message: 'Delete Category.', categoryDeleted});
          
    }catch(err){
        console.log(err); 
        return err; 
    }
}






