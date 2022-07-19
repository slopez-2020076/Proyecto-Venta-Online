'use strict'

const userController = require('../controllers/user.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');


api.get('/test', userController.test);
api.post('/register', userController.register);
api.post('/login', userController.login);
api.put('/update/:id', mdAuth.ensureAuth, userController.update);
api.delete('/delete/:id', mdAuth.ensureAuth, userController.delete);

api.put('/updateByAdmin/:id', mdAuth.ensureAuth, mdAuth.isAdmin, userController.updateByAdmin);
api.post('/saveByAdmin', mdAuth.ensureAuth, mdAuth.isAdmin, userController.saveByAdmin);
api.delete('/deleteByAdmin/:id', mdAuth.ensureAuth, mdAuth.isAdmin, userController.deleteByAdmin)

module.exports = api;