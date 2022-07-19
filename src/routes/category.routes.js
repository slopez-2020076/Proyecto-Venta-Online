'use strict'

const categoryController = require('../controllers/category.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');


api.get('/test', categoryController.testCategory);
api.post('/saveCategory', mdAuth.ensureAuth, mdAuth.isAdmin, categoryController.saveCategory);
api.get('/getCategorys', mdAuth.ensureAuth, mdAuth.isAdmin, categoryController.getCategorys);
api.put('/updateCategory/:id', mdAuth.ensureAuth, mdAuth.isAdmin, categoryController.updateCategory);
api.delete('/deleteCategory/:id', mdAuth.ensureAuth, mdAuth.isAdmin, categoryController.deleteCategory);


module.exports = api;