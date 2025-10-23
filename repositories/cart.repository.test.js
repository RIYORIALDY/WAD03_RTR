const { describe, test, expect, beforeEach } = require('@jest/globals');
const cartRepository = require('./cartRepository');
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    cart: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    cartItem: {
      delete: jest.fn(),
      deleteMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('Cart Repository - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUsername', () => {
    test('[POSITIVE] should find cart by username', async () => {
      const mockCart = {
        id: 1,
        userId: 1,
        items: [{ id: 1, productId: 1, quantity: 1, product: { id: 1, name: 'Product' } }],
      };
      prisma.cart.findUnique.mockResolvedValue(mockCart);

      const result = await cartRepository.findByUsername('buyer1');

      expect(result).toEqual(mockCart);
      expect(prisma.cart.findUnique).toHaveBeenCalledWith({
        where: { user: { username: 'buyer1' } },
        include: { items: { include: { product: true } } },
      });
    });

    test('[NEGATIVE] should return null when cart not found', async () => {
      prisma.cart.findUnique.mockResolvedValue(null);

      const result = await cartRepository.findByUsername('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('addItem', () => {
    test('[POSITIVE] should add item to cart', async () => {
      const mockUpdatedCart = { id: 1, userId: 1, items: [{ id: 1, productId: 1, quantity: 1 }] };
      prisma.cart.update.mockResolvedValue(mockUpdatedCart);

      const result = await cartRepository.addItem(1, 1, 1);

      expect(result).toEqual(mockUpdatedCart);
      expect(prisma.cart.update).toHaveBeenCalledWith({
        where: { userId: 1 },
        data: { items: { create: { productId: 1, quantity: 1 } } },
        include: { items: true },
      });
    });
  });

  describe('removeItem', () => {
    test('[POSITIVE] should remove item from cart', async () => {
      prisma.cart.findUnique.mockResolvedValue({ id: 1, userId: 1 });
      prisma.cartItem.findFirst.mockResolvedValue({ id: 1, cartId: 1, productId: 1 });
      prisma.cartItem.delete.mockResolvedValue({ id: 1 });

      const result = await cartRepository.removeItem(1, 1);

      expect(result).toEqual({ id: 1 });
      expect(prisma.cartItem.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    test('[NEGATIVE] should throw error if cart not found', async () => {
      prisma.cart.findUnique.mockResolvedValue(null);
      await expect(cartRepository.removeItem(1, 1)).rejects.toThrow('Cart not found');
    });

    test('[NEGATIVE] should throw error if item not found in cart', async () => {
      prisma.cart.findUnique.mockResolvedValue({ id: 1, userId: 1 });
      prisma.cartItem.findFirst.mockResolvedValue(null);
      await expect(cartRepository.removeItem(1, 1)).rejects.toThrow('Item not found in cart');
    });
  });

  describe('clear', () => {
    test('[POSITIVE] should clear all items from cart', async () => {
      prisma.cart.findUnique.mockResolvedValue({ id: 1, userId: 1 });
      prisma.cartItem.deleteMany.mockResolvedValue({ count: 2 });

      const result = await cartRepository.clear(1);

      expect(result).toEqual({ count: 2 });
      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: 1 } });
    });

    test('[NEGATIVE] should throw error if cart not found', async () => {
      prisma.cart.findUnique.mockResolvedValue(null);
      await expect(cartRepository.clear(1)).rejects.toThrow('Cart not found');
    });
  });
});
