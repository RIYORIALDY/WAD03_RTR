const prisma = require('../prisma/db');

class CartsRepository {
  async findAll() {
    return prisma.cart.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  }

  async findByUsername(username) {
    return prisma.cart.findUnique({
      where: { user: { username } },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async addItem(userId, productId, quantity) {
    return prisma.cart.update({
      where: { userId },
      data: {
        items: {
          create: { productId, quantity },
        },
      },
      include: {
        items: true,
      },
    });
  }

  async removeItem(userId, productId) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw new Error('Cart not found');
    }
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });
    if (!cartItem) {
      throw new Error('Item not found in cart');
    }
    return prisma.cartItem.delete({ where: { id: cartItem.id } });
  }

  async clear(userId) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw new Error('Cart not found');
    }
    return prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}

module.exports = new CartsRepository();
