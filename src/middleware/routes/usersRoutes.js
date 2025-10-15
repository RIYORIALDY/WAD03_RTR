const express = require('express');
const router = express.Router();
const usersController = require('../controller/usersController');

// POST /users/ - Create user
router.post('/', usersController.createUser);

// GET /users/ - Get all users
router.get('/', usersController.getAllUsers);

// GET /users/:username - Get user by username
router.get('/:username', usersController.getUserByUsername);

module.exports = router;