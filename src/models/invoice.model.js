'use strict'

const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
    empresa: String,
    direccion: String,
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    nit: String,
    cart: { type: mongoose.Schema.ObjectId, ref: 'Cart' },
    total: Number
});
module.exports = mongoose.model('Invoice', billSchema);