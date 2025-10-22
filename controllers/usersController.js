const usersService = require('../services/usersService');

const createUser = async (req, res) => {
  try {
    const newUser = await usersService.createUser(req.body);
    res.status(201).json({ 
      message: 'User created successfully', 
      data: newUser 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json({ 
      message: 'Users retrieved successfully', 
      data: users 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await usersService.getUserByUsername(username);
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
