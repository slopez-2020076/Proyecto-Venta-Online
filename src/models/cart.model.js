const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
    quantity: Number,
    subtotal: Number
});

module.exports = mongoose.model('Cart', cartSchema);