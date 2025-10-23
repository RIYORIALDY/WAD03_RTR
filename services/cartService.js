const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const usersRepository = require('../repositories/usersRepository');
const productsRepository = require('../repositories/productsRepository');

class CartService {
  async getCartByUsername(username) {
    const user = await usersRepository.findByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== 'buyer') {
      throw new Error('Only buyers can have carts');
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
        include: {
          items: true,
        },
      });
    }

    return cart;
  }

  async addItemToCart(username, item) {
    const { productName, quantity } = item;
    if (!productName || !quantity || quantity <= 0) {
      throw new Error('Invalid item data: productName and a positive quantity are required');
    }

    const cart = await this.getCartByUsername(username);
    const product = await productsRepository.findByName(productName);
    if (!product) {
      throw new Error('Product not found');
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: product.id,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity,
        },
      });
    }

    return this.getCartByUsername(username);
  }

  async removeItemFromCart(username, productName) {
    const cart = await this.getCartByUsername(username);
    const product = await productsRepository.findByName(productName);
    if (!product) {
      throw new Error('Product not found');
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: product.id,
      },
    });

    if (!cartItem) {
      throw new Error('Item not found in cart');
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return this.getCartByUsername(username);
  }

  async clearCart(username) {
    const cart = await this.getCartByUsername(username);
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    return this.getCartByUsername(username);
  }
}

module.exports = new CartService();
