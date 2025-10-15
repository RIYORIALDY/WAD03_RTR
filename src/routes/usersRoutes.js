const express = require('express');
const router = express.Router();
const usersController = require('../controller/usersController');

router.post('/', usersController.createUser);

router.get('/', usersController.getAllUsers);

router.get('/:username', usersController.getUserByUsername);

module.exports = router;