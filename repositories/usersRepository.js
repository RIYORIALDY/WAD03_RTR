const prisma = require('../prisma/db');

class UsersRepository {
  async findAll() {
    return prisma.user.findMany();
  }

  async findByUsername(username) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async save(userData) {
    return prisma.user.create({
      data: userData,
    });
  }

  async exists(username) {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    return user !== null;
  }
}

module.exports = new UsersRepository();
