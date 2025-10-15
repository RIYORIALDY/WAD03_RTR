const usersService = require('../services/usersService');

// POST /users/ - Create new user
const createUser = (req, res) => {
  try {
    const newUser = usersService.createUser(req.body);
    res.status(201).json({ 
      message: 'User created successfully', 
      data: newUser 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /users/ - Get all users
const getAllUsers = (req, res) => {
  try {
    const users = usersService.getAllUsers();
    res.status(200).json({ 
      message: 'Users retrieved successfully', 
      data: users 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /users/:username - Get user by username
const getUserByUsername = (req, res) => {
  try {
    const { username } = req.params;
    const user = usersService.getUserByUsername(username);
    res.status(200).json({ 
      message: 'User retrieved successfully', 
      data: user 
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserByUsername
};