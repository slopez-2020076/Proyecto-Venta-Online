'use strict'

const productController = require('../controllers/product.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');


api.get('/test', productController.testProduct);
api.post('/saveProduct', mdAuth.ensureAuth, mdAuth.isAdmin, productController.saveProduct);
api.get('/getProducts', mdAuth.ensureAuth, mdAuth.isAdmin, productController.getProducts);
api.get('/getProduct', mdAuth.ensureAuth, mdAuth.isAdmin, productController.getProduct);
api.put('/updateProduct/:id', mdAuth.ensureAuth, mdAuth.isAdmin, productController.updateProduct);
api.get('/stock', mdAuth.ensureAuth, mdAuth.isAdmin, productController.stock);
api.get('/exhausted', mdAuth.ensureAuth, mdAuth.isAdmin, productController.getExhausted);
api.get('/getSales', mdAuth.ensureAuth, productController.getSales);
api.delete('/delete/:id', mdAuth.ensureAuth, mdAuth.isAdmin, productController.deleteProduct);


api.post('/productsCatalog/:id', mdAuth.ensureAuth, productController.productsCatalog);
api.post('/searchProduct', mdAuth.ensureAuth, productController.searchProduct);

module.exports = api; 