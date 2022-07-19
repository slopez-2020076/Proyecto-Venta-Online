'use strict'

const Cart = require('../controllers/cart.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.post('/saveCart', mdAuth.ensureAuth,  Cart.saveCart);


module.exports = api; 