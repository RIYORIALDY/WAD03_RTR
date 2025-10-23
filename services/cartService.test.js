const { describe, test, expect, beforeEach } = require('@jest/globals');
const cartService = require('../services/cartService');
const usersRepository = require('../repositories/usersRepository');
const productsRepository = require('../repositories/productsRepository');
const { PrismaClient } = require('@prisma/client');

jest.mock('../repositories/usersRepository', () => ({
  findByUsername: jest.fn(),
}));

jest.mock('../repositories/productsRepository', () => ({
  findByName: jest.fn(),
}));

jest.mock('@prisma/client', () => {
    const mPrismaClient = {
      cart: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      cartItem: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
  });
  
const prisma = new PrismaClient();

describe('Cart Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCartByUsername', () => {
    test('[POSITIVE] should return cart for a valid user', async () => {
      const user = { id: 1, username: 'buyer1', role: 'buyer' };
      const mockCart = { id: 1, userId: 1, items: [] };
      usersRepository.findByUsername.mockResolvedValue(user);
      prisma.cart.findUnique.mockResolvedValue(mockCart);

      const result = await cartService.getCartByUsername('buyer1');

      expect(result).toEqual(mockCart);
      expect(usersRepository.findByUsername).toHaveBeenCalledWith('buyer1');
      expect(prisma.cart.findUnique).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: { items: { include: { product: true } } },
      });
    });

    test('[POSITIVE] should create cart if not exists for a buyer', async () => {
        const user = { id: 1, username: 'buyer1', role: 'buyer' };
        const newCart = { id: 1, userId: 1, items: [] };
        usersRepository.findByUsername.mockResolvedValue(user);
        prisma.cart.findUnique.mockResolvedValue(null);
        prisma.cart.create.mockResolvedValue(newCart);
  
        const result = await cartService.getCartByUsername('buyer1');
  
        expect(result).toEqual(newCart);
        expect(prisma.cart.create).toHaveBeenCalledWith({
          data: { userId: 1 },
          include: { items: true },
        });
      });

    test('[NEGATIVE] should throw error if user not found', async () => {
      usersRepository.findByUsername.mockResolvedValue(null);
      await expect(cartService.getCartByUsername('nonexistent')).rejects.toThrow('User not found');
    });

    test('[NEGATIVE] should throw error if user is not a buyer', async () => {
      const user = { id: 1, username: 'seller1', role: 'seller' };
      usersRepository.findByUsername.mockResolvedValue(user);
      await expect(cartService.getCartByUsername('seller1')).rejects.toThrow('Only buyers can have carts');
    });
  });

  describe('addItemToCart', () => {
    test('[POSITIVE] should add a new item to the cart', async () => {
        const user = { id: 1, username: 'buyer1', role: 'buyer' };
        const product = { id: 1, name: 'Laptop' };
        const cart = { id: 1, userId: 1, items: [] };
        const item = { productName: 'Laptop', quantity: 1 };
    
        // Mock the sequence of calls
        usersRepository.findByUsername.mockResolvedValue(user);
        prisma.cart.findUnique.mockResolvedValue(cart); // For the initial getCartByUsername
        productsRepository.findByName.mockResolvedValue(product);
        prisma.cartItem.findFirst.mockResolvedValue(null); // Item does not exist in cart
        prisma.cartItem.create.mockResolvedValue({}); // Mock the creation
    
        // Mock the final getCartByUsername call which returns the updated cart
        const updatedCart = { ...cart, items: [{...item, productId: 1}] };
        // This is a bit tricky, we need to mock the second call to getCartByUsername
        cartService.getCartByUsername = jest.fn().mockResolvedValueOnce(cart).mockResolvedValueOnce(updatedCart);

        const result = await cartService.addItemToCart('buyer1', item);
    
        expect(prisma.cartItem.create).toHaveBeenCalledWith({
          data: { cartId: cart.id, productId: product.id, quantity: 1 },
        });
        expect(result).toEqual(updatedCart);
      });

    test('[NEGATIVE] should throw error for invalid item data', async () => {
      const invalidItem = { productName: '', quantity: 1 };
      await expect(cartService.addItemToCart('buyer1', invalidItem)).rejects.toThrow('Invalid item data');
    });

    test('[NEGATIVE] should throw error if product not found', async () => {
        const user = { id: 1, username: 'buyer1', role: 'buyer' };
        const cart = { id: 1, userId: 1, items: [] };
        const item = { productName: 'nonexistent', quantity: 1 };
        
        usersRepository.findByUsername.mockResolvedValue(user);
        prisma.cart.findUnique.mockResolvedValue(cart);
        productsRepository.findByName.mockResolvedValue(null);

        await expect(cartService.addItemToCart('buyer1', item)).rejects.toThrow('Product not found');
    });
  });

  describe('removeItemFromCart', () => {
    test('[POSITIVE] should remove item from cart', async () => {
        const user = { id: 1, username: 'buyer1', role: 'buyer' };
        const product = { id: 1, name: 'Laptop' };
        const cart = { id: 1, userId: 1, items: [{ id: 1, productId: 1, quantity: 1 }] };
        const cartItem = { id: 1, cartId: 1, productId: 1 };

        cartService.getCartByUsername = jest.fn().mockResolvedValue(cart);
        productsRepository.findByName.mockResolvedValue(product);
        prisma.cartItem.findFirst.mockResolvedValue(cartItem);
        prisma.cartItem.delete.mockResolvedValue({});

        await cartService.removeItemFromCart('buyer1', 'Laptop');

        expect(prisma.cartItem.delete).toHaveBeenCalledWith({ where: { id: cartItem.id } });
    });

    test('[NEGATIVE] should throw error if item not found in cart', async () => {
        const user = { id: 1, username: 'buyer1', role: 'buyer' };
        const product = { id: 1, name: 'Laptop' };
        const cart = { id: 1, userId: 1, items: [] };

        cartService.getCartByUsername = jest.fn().mockResolvedValue(cart);
        productsRepository.findByName.mockResolvedValue(product);
        prisma.cartItem.findFirst.mockResolvedValue(null);

        await expect(cartService.removeItemFromCart('buyer1', 'Laptop')).rejects.toThrow('Item not found in cart');
    });
  });

  describe('clearCart', () => {
    test('[POSITIVE] should clear all items from the cart', async () => {
        const user = { id: 1, username: 'buyer1', role: 'buyer' };
        const cart = { id: 1, userId: 1, items: [{ id: 1, productId: 1, quantity: 1 }] };

        cartService.getCartByUsername = jest.fn().mockResolvedValue(cart);
        prisma.cartItem.deleteMany.mockResolvedValue({});

        await cartService.clearCart('buyer1');

        expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: cart.id } });
    });
  });
});
