'use strict'

const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { validateData } = require('../utils/validate');


exports.testCart = (req, res) => {
    console.log(req)
    return res.send({ message: 'The function is running' });
}

exports.saveCart = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub
        const data = {
            product: params.product,
            quantity: params.quantity
        };
        const msg = validateData(data);
        if (!msg) {
            const product = await Product.findOne({ _id: params.product });
            if (!product) return res.send({ message: 'Product not Found' });
            const stock = await Product.findOne({ _id: data.product });
            if (data.quantity > stock.stock) return res.send({ message: 'Not enough products in stock' });
            data.user = userId;
            data.subtotal = (product.price) * (data.quantity);
            const cart = new Cart(data);
            await cart.save();
            let shoppingCartId = await Cart.findOne({user: userId});
            let push = await Cart.findOneAndUpdate({_id: shoppingCartId._id}, {$push: {products: data}}, {new: true}).populate('user').populate('product');
            push.user.password = undefined;
            push.user.role = undefined;
            push.product.category = undefined;
            push.product.sales = undefined;
            push.product.stock = undefined;
            return res.send({ message: 'Added to cart', push });
        } else return res.send(msg);
    } catch (err) {
        console.log(err);
        return err;
    }
}
