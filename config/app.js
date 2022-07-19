'use strict'

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('../src/routes/product.routes');
const userRoutes = require('../src/routes/user.routes');
const categoryRoutes = require('../src/routes/category.routes');
const cartRoutes = require('../src/routes/cart.routes');
const invoiceRoutes = require('../src/routes/invoice.routes');

const app = express();//instancia de express

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use('/user', userRoutes);
app.use('/products', productRoutes);
app.use('/category', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/invoice', invoiceRoutes);


module.exports = app;