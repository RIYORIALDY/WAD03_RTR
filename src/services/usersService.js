const usersRepository = require('../repositories/usersRepository');

class UsersService {
  createUser(userData) {
    const { username, name, email, role } = userData;

    if (!username || !name || !email || !role) {
      throw new Error('All fields are required: username, name, email, role');
    }

    if (role !== 'buyer' && role !== 'seller') {
      throw new Error('Role must be either "buyer" or "seller"');
    }

    if (usersRepository.exists(username)) {
      throw new Error('Username already exists');
    }

    const newUser = {
      username,
      name,
      email,
      role
    };

    return usersRepository.save(newUser);
  }

  getAllUsers() {
    return usersRepository.findAll();
  }

  getUserByUsername(username) {
    const user = usersRepository.findByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new UsersService();
