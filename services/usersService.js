const usersRepository = require('../repositories/usersRepository');

class UsersService {
  async createUser(userData) {
    const { username, name, email, role } = userData;

    if (!username || !name || !email || !role) {
      throw new Error('All fields are required: username, name, email, role');
    }

    if (role !== 'buyer' && role !== 'seller') {
      throw new Error('Role must be either "buyer" or "seller"');
    }

    const exists = await usersRepository.exists(username);
    if (exists) {
      throw new Error('Username already exists');
    }

    const newUser = {
      username,
      name,
      email,
      role
    };

    return await usersRepository.save(newUser);
  }

  async getAllUsers() {
    return await usersRepository.findAll();
  }

  async getUserByUsername(username) {
    const user = await usersRepository.findByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new UsersService();
