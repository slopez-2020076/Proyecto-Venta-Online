'use strict'

const Invoice = require('../models/invoice.model');
const jwt = require('../services/jwt');
const User = require('../models/user.model');
const {validateData, searchUser, encrypt, checkPass, checkPermission, checkUpdated, } = require('../utils/validate');


exports.test = (req, res)=>{
    return res.send({message: 'The function test is running'});
}




exports.register = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            password: params.password,
            role: 'CLIENT'
        }
        const msg = validateData(data);

        if(!msg){
            let userExist = await searchUser(params.username);
            if(!userExist){
                data.surname= params.surname; 
                data.email = params.email; 
                data.phone = params.phone; 
                data.password = await encrypt(params.password);
                
                let user = new User(data);
                await user.save();
                return res.send({message: 'User created successfully'});

            }else{
                return res.send({message: 'Username already in use, choose another username'});
            }
        }else {
            return res.send(msg);
        }
    }catch(err){
        console.log(err)
        return err;
    }
}




exports.login = async (req, res)=>{
    try{
        const params = req.body; 
        const data= {
            username: params.username, 
            password: params.password
        }
        let msg = validateData(data);

        if(!msg){
            let userExist = await searchUser(params.username);
            if(userExist && await checkPass(params.password, userExist.password)){
                const token = await jwt.createToken(userExist);
                const usert = await User.findOne({username: data.username});

                const invoiceUser = await Invoice.find({user: usert.id}).populate('cart').populate('user');
                for(let user of invoiceUser){
                    user.user.password = undefined; 
                    user.user.role = undefined;
                    user.cart.user = undefined;
                }
                if(!invoiceUser) return res.send({message: 'Invoices not Found'});
                return res.send({token, message: 'Login Successfully', invoiceUser}); 
            }else{
                return res.send({ message: 'Username or password Incorrect'});
            }
        }else{
            return res.status(400).send({message: 'Missing data'});
        } 
    }catch(err){
        console.log(err);
        return err;
    }
}





exports.update = async (req, res)=>{
    try{
        const userID = req.params.id;
        const params = req.body;
        const permission = await checkPermission(userID, req.user.sub);
        if(permission === false){
            return res.status(403).send({message: 'Unauthorized to update this user'})
        }else{
            const notUpdated = await checkUpdated(params);
            if(notUpdated === false){
                return res.status(400).send({message: 'This params can only updated by admin'});
            }else{
                const already = await searchUser(params.username);
                if(!already){
                    const userUpdate = await User.findOneAndUpdate({id: userID}, params, {new: true}).lean()
                    return res.send({userUpdate , message: 'User updated'})
                }else{
                    return res.send({message: 'Username already taken'});
                }
            }
        }
    }catch(err){
        console.log(err);
        return err; 
    }
}



exports.delete = async (req, res) =>{
    try{
        const userId = req.params.id; 
        const permission = await checkPermission(userId, req.user.sub); 
        if(permission === false) return res.status(403).send({message: 'Acction unathorized'});
        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(userDeleted) return res.send({userDeleted, message: 'Account Deleted'});
        return res.send({userDeleted, message: 'User not found or already deleted'});
    }catch(err){
        console.log(err); 
        return err; 
    }
}




exports.saveByAdmin = async (req, res) =>{
    try {
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            password: params.password,
            role: params.role
        }
        const msg = validateData(data);
        if(!msg){
            let userExist = await searchUser(params.username);
            if(!userExist){
                data.surname= params.surname; 
                data.email = params.email; 
                data.phone = params.phone; 
                data.password = await encrypt(params.password);
                
                let user = new User(data);
                await user.save();
                return res.send({message: 'User created successfully'});

            }else{
                return res.send({message: 'Username already in use, choose another username'});
            }
        }else {
            return res.send(msg);
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}





exports.updateByAdmin = async (req, res) => {
    try {
        const userID = req.params.id;
        const params = req.body;
        if(Object.entries(params).length === 0 ) return res.send({message: 'Data not recived'});
        const msg = validateData(params);
        if(!msg){   
            const checkAdmin = await User.findOne({_id: userID});
            if(checkAdmin.role === 'ADMIN') return res.send({message: 'Updated is not allowed, user is Admin'});
            const userExist = await searchUser(params.username);
            if (!userExist) {
                const userUpdated = await User.findOneAndUpdate({ _id: userID }, params, { new: true });
                return res.send({ userUpdated, message: 'User updated' })
            }else return res.send({ message: 'Username already taken' })

        }else return res.send({message: 'Some parameter is empty'})
    } catch (err) {
        console.log(err);
        return err;
    }
}



exports.deleteByAdmin = async (req, res) =>{
    try{
        const userID = req.params.id; 
        const checkAdmin = await User.findOne({_id: userID});
        if(checkAdmin.role === 'ADMIN') return res.send({message: 'Delete not allowed, user is Admin'});
        const userDeleted = await User.findOneAndDelete({_id: userID});
        if(userDeleted) return res.send({userDeleted, message: 'Account Deleted'});
        return res.send({userDeleted, message: 'User not found or already deleted'});
    }catch(err){
        console.log(err);
        return err;
    }
}

