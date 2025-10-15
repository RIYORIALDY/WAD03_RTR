const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../../data/users.json');

class UsersRepository {
  findAll() {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  }

  findByUsername(username) {
    const users = this.findAll();
    return users.find(u => u.username === username);
  }

  save(user) {
    const users = this.findAll();
    users.push(user);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    return user;
  }

  exists(username) {
    return this.findByUsername(username) !== undefined;
  }
}

module.exports = new UsersRepository();
