'use strict'

const mongoose = require('mongoose');

function init(){
    const uriMongo = 'mongodb://127.0.0.1:27017/proyectoVentasOnline'
    mongoose.Promise = global.Promise;
    
    mongoose.connection.on('error', ()=>{
        console.log('MongoDB | Could not conecct to the database. Exiting...');
        mongoose.disconnect();
    });

    mongoose.connection.on('coneccting', ()=>{
        console.log('Connecting to MongoDB');
    });

    mongoose.connection.on('connected', ()=>{
        console.log('MongoDB connected');
    });
    
    mongoose.connection.once('open', ()=>{
        console.log('MongoDB | Succesfully connected to the database.');
    });


    mongoose.connection.on('reconnected', ()=>{
        console.log('MongoDB reconnected');
    });

    mongoose.connection.on('disconnected', ()=>{
        console.log('MongoD disconnected');
    });

    mongoose.connect(uriMongo,{
        maxPoolSize : 50,
        connectTimeoutMS: 2500,
        useNewUrlParser : true
    }).catch(err=>{console.log(err)})

}

module.exports.init = init;
