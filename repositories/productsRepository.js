const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProductsRepository {
  async save(productData) {
    return prisma.product.create({
      data: productData,
    });
  }

  async findAll() {
    return prisma.product.findMany();
  }

  async findByOwner(ownerId) {
    return prisma.product.findMany({
      where: { ownerId },
    });
  }

  async findByName(name) {
    return prisma.product.findUnique({
      where: { name },
    });
  }
}

module.exports = new ProductsRepository();
