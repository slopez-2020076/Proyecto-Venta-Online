'use strict'

const invoiceController = require('../controllers/bill.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.post('/saveInvoice', mdAuth.ensureAuth, invoiceController.saveInvoice);
api.put('/updateInvoice/:id', mdAuth.ensureAuth, mdAuth.isAdmin, invoiceController.updateInvoice);
api.post('/getInvoices/:id', mdAuth.ensureAuth, invoiceController.getInvoices);
api.post('/productsInvoice/:id', mdAuth.ensureAuth, invoiceController.dataInvoice);

module.exports = api; 