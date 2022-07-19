'use strict'

const Invoice = require('../models/invoice.model');
const { validateData} = require('../utils/validate');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

exports.saveInvoice = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub;
        const data = {
            empresa: 'Fast Supermarket',
            direccion: '12 Avenida 11-16, Zona 12 Cdad. de Guatemala',
            user: req.user.sub,
            cart: params.cart,
            nit: params.nit,
        }
        const msg = validateData(data);
        if (!msg) {
            const search = await Cart.findOne({ _id: params.cart });
            if (!search) return res.send({ message: 'Cart not Found' });
            const validateStock = await Product.findOne({_id: search.product});
            const resta = (validateStock.stock - search.quantity);
            const suma = (validateStock.sales + search.quantity);
            const updateStock = await Product.findOneAndUpdate({_id: validateStock._id}, {stock: resta}, {new: true});
            const updateSales = await Product.findOneAndUpdate({_id: validateStock._id}, {sales: suma}, {new: true});
            const invoice = new Invoice(data);
            await invoice.save();
            const invoiceUser = await Invoice.findOne({user: userId});
            const push = await Invoice.findOneAndUpdate({_id: invoiceUser._id}, {$push: {carts: data}}, {new: true}).populate('cart').populate('user');
            push.user.password = undefined;
            push.user.role = undefined;
            return res.send({message: 'Invoice:', push});
        } else return res.send(msg)
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.getInvoices = async (req, res) =>{
    try{
        const userID = req.params.id;
        const invoices = await Invoice.find({user: userID});
        if(!invoices) return res.send({message: 'Invoice not found'});
        else return res.send({message: 'Invoices:', invoices})
    }catch(err){
        console.log(err);
        return err; 
    }
}



exports.dataInvoice = async (req, res) =>{
    try{
        const invoiceID = req.params.id;
        const descripInvoice = await Invoice.findOne({_id: invoiceID}).populate('cart').lean();
        if(!descripInvoice) return res.send({message: 'Invoice not Found'});
        descripInvoice.empresa = undefined;
        descripInvoice.direccion = undefined;
        descripInvoice.user = undefined;
        descripInvoice.nit = undefined;
        descripInvoice.cart.user = undefined;
        descripInvoice.cart.subtotal = undefined;
        descripInvoice.cart.quantity = undefined;
        return res.send({message: 'Description Products', descripInvoice}); 
    }catch(err){
        console.log(err); 
        return err; 
    }
}



exports.updateInvoice = async (req, res) =>{
    try {
        const params = req.body;
        const invoiceID = req.params.id;
        const check = await checkUpdated(params);
        if(check === false) return res.status(400).send({message: 'Data not recived'});
        const updateInvoice = await Invoice.findOneAndUpdate({_id: invoiceID}, params, {new:true}).populate('cart').populate('user');
        updateInvoice.user.password = undefined;
        updateInvoice.user.role = undefined;
        return res.send({message: 'Update Invoice', updateInvoice})
    }catch(err){
        console.log(err);
        return err;
    }
}