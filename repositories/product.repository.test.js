const { describe, test, expect, beforeEach } = require('@jest/globals');
const productsRepository = require('./productsRepository');
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('Products Repository - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    test('[POSITIVE] should return all products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', category: 'Cat1', price: 1000, ownerId: 1 },
        { id: 2, name: 'Product 2', category: 'Cat2', price: 2000, ownerId: 2 },
      ];
      prisma.product.findMany.mockResolvedValue(mockProducts);

      const result = await productsRepository.findAll();

      expect(result).toHaveLength(2);
      expect(prisma.product.findMany).toHaveBeenCalledTimes(1);
    });

    test('[BOUNDARY] should return empty array when no products', async () => {
      prisma.product.findMany.mockResolvedValue([]);

      const result = await productsRepository.findAll();

      expect(result).toEqual([]);
      expect(prisma.product.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByName', () => {
    test('[POSITIVE] should find product by name', async () => {
      const mockProduct = { id: 1, name: 'Laptop', category: 'Electronics', price: 10000, ownerId: 1 };
      prisma.product.findUnique.mockResolvedValue(mockProduct);

      const result = await productsRepository.findByName('Laptop');

      expect(result).toEqual(mockProduct);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { name: 'Laptop' } });
    });

    test('[NEGATIVE] should return null when product not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      const result = await productsRepository.findByName('NonExistent');

      expect(result).toBeNull();
      expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { name: 'NonExistent' } });
    });
  });

  describe('findByOwner', () => {
    test('[POSITIVE] should return products by owner', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', category: 'Cat1', price: 1000, ownerId: 1 },
        { id: 2, name: 'Product 2', category: 'Cat2', price: 2000, ownerId: 1 },
      ];
      prisma.product.findMany.mockResolvedValue(mockProducts);

      const result = await productsRepository.findByOwner(1);

      expect(result).toHaveLength(2);
      expect(prisma.product.findMany).toHaveBeenCalledWith({ where: { ownerId: 1 } });
    });

    test('[BOUNDARY] should return empty array if owner has no products', async () => {
      prisma.product.findMany.mockResolvedValue([]);

      const result = await productsRepository.findByOwner(999);

      expect(result).toEqual([]);
      expect(prisma.product.findMany).toHaveBeenCalledWith({ where: { ownerId: 999 } });
    });
  });

  describe('save', () => {
    test('[POSITIVE] should save new product', async () => {
      const productData = { name: 'New Product', category: 'Category', price: 5000, ownerId: 1 };
      const mockSavedProduct = { id: 1, ...productData };
      prisma.product.create.mockResolvedValue(mockSavedProduct);

      const result = await productsRepository.save(productData);

      expect(result).toEqual(mockSavedProduct);
      expect(prisma.product.create).toHaveBeenCalledWith({ data: productData });
    });
  });
});
