'use strict'


const jwt = require('jwt-simple');
const moment = require('moment')
const secretKey = 'cualquierDato';

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'The request does not contain the authentication header'});
    }else{
        try{
            let token = req.headers.authorization.replace(/['"]+/g, '');
            var  payload = jwt.decode(token, secretKey);
            if(payload.exp <= moment().unix()){
                return res.status(403).send({message: 'Token expired'});
            }
        }catch(err){
            console.log(err);
            return res.status(400).send({message: 'Token is not valid'});
        }
        req.user = payload;
        next();
    }
}


exports.isAdmin = async (req, res, next)=>{
    try{
        const user = req.user; 
        if(user.role === 'ADMIN') next()
        else return res.status(403).send({message: 'User unauthorized'});
    }catch(err){
        console.log(err); 
        return err; 
    }
}