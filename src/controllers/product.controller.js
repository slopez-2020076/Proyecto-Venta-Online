'use strict'

const Category = require('../models/category.model');
const Product = require('../models/product.model');
const { validateData, checkUpdated} = require('../utils/validate');



exports.testProduct = (req, res)=>{
    return res.send ({message: 'Function test is running'});
}



exports.saveProduct = async(req, res)=>{
    try {
        const params = req.body;
        const data = {
            name: params.name,
            price: params.price,
            stock: params.stock,
            sales: 0,
            category: params.category, 
        };
        const categoryExist = params.category;
        const msg = validateData(data);
        if(!msg){
            const productExist = await Product.findOne({ $and: [{name: params.name}, {category: params.category}]});
            const categoryEx = await Category.findOne({_id: categoryExist});
            if(!categoryEx) return res.send({message: 'Category not found'})
            if(!productExist){
                const product = new Product(data);
                await product.save()
                return res.send({message: 'Product save'});

            }else return res.send({message: 'The product you entered already exists'});
        
        }else return res.status(400).send(msg);

    } catch (err) {
        console.log(err);
        return err; 
    }
}



exports.getProducts = async(req, res)=>{
    try{
        const products = await Product.find().populate('category').lean();
        return res.send({message: 'Products:', products})
    }catch(err){
        console.log(err);
        return err;
    }
}



exports.getProduct = async(req, res)=>{
    try{
        const productID = req.params.id;
        const products = await Product.findOne({_id: productID}).populate('category').lean();
        return res.send({message: 'Products:', products})
    }catch(err){
        console.log(err);
        return err;
    }
}



exports.searchProduct = async (req, res) =>{
    try{
        const params = req.body;
        const data = { name: params.name};

        const msg = validateData(data);
        if(!msg){
            const product = await Product.find({name: {$regex: params.name, $options: 'i'}});
            return res.send({product});
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return err; 
    }
}



exports.updateProduct = async (req, res)=>{
    try{
        const productId = req.params.id;
        const params = req.body;
        const check = await checkUpdated(params);
        if(check === false) return res.status(400).send({message: 'Data not recived'});
        const msg = validateData(params);
        if(!msg){
            
            const productExist = await Product.findOne({ $and: [{name: params.name}, {category: params.category}]});
            if(!productExist ){
                const updateProduct = await Product.findOneAndUpdate({_id: productId}, params, {new: true});
                if(!updateProduct) return res.send({message: 'Product not found'});
                return res.send ({message: 'Product update', updateProduct});
            }else{
                return res.send({message: 'Product already created on this name or category'})
            }
            
        }else return res.status(400).send({message: 'Some parameter is empty'})
    }catch(err){
        console.log(err);
        return err;
    }
}






exports.deleteProduct = async (req, res)=>{
    try{
        const productID = req.params.id;
        const productDeleted = await Product.findOneAndDelete({_id: productID}); 
        if(!productDeleted){
            return res.status(500).send({message: 'Product not found or already deleted'});
        }else return res.send({productDeleted, message: 'Product Deleted'});

    }catch(err){
        console.log(err); 
        return err; 
    }
}



exports.stock = async (req, res) =>{
    try{
        const products = await Product.find();
        for(let produ of products){
            produ.price = undefined; 
            produ.description = undefined; 
            produ.sales = undefined;
            produ.category = undefined;
        } 
        return res.send({message: 'Stock', products})
    }catch(err){
        console.log(err);
        return err; 
    }
}



exports.getExhausted = async (req, res) =>{
    try{
        const products = await Product.find();
        const productsExhausted = products.filter(item => {
            if(item.stock === 0){
                return true;
            }else {
                return false;
            }
        });
        return res.send({productsExhausted});
    }catch(err){
        console.log(err);
        return err; 
    }
}




exports.getSales= async(req, res)=>{
    try{
        const products = await Product.find();
        products.sort((a,b) =>{ return b.sales-a.sales; });
        const fav = products.slice(0, 3);
        return res.send({fav});
    }catch(err){
        console.log(err);
        return err;
    }
}



exports.productsCatalog = async (req, res) =>{
    try{
        const categoryID = req.params.id;
        const productExist = await Product.find({category: categoryID});
        if(!productExist) return res.send({message: 'Products not Found'});
        return res.send({productExist}) ;
    }catch(err){
        console.log(err);
        return err;
    }
}

