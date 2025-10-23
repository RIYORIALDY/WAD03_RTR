const { describe, test, expect, beforeEach } = require('@jest/globals');
const productsService = require('../services/productsService');
const productsRepository = require('../repositories/productsRepository');
const usersRepository = require('../repositories/usersRepository');

jest.mock('../repositories/productsRepository', () => ({
  findAll: jest.fn(),
  findByOwner: jest.fn(),
  findByName: jest.fn(),
  save: jest.fn(),
}));

jest.mock('../repositories/usersRepository', () => ({
  findByUsername: jest.fn(),
}));

describe('Products Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    test('[POSITIVE] should create product successfully with valid data', async () => {
      const productData = { productName: 'Laptop Gaming', productCategory: 'Electronics', price: 15000000, owner: 'seller1' };
      const owner = { id: 1, username: 'seller1' };
      const newProductData = { name: 'Laptop Gaming', category: 'Electronics', price: 15000000, ownerId: 1 };
      
      productsRepository.findByName.mockResolvedValue(null);
      usersRepository.findByUsername.mockResolvedValue(owner);
      productsRepository.save.mockResolvedValue({ id: 1, ...newProductData });

      const result = await productsService.createProduct(productData);

      expect(result).toBeDefined();
      expect(usersRepository.findByUsername).toHaveBeenCalledWith('seller1');
      expect(productsRepository.save).toHaveBeenCalledWith(newProductData);
    });

    test('[NEGATIVE] should throw error if product name is empty', async () => {
      const invalidData = { productName: '', productCategory: 'Electronics', price: 15000000, owner: 'seller1' };
      await expect(productsService.createProduct(invalidData)).rejects.toThrow('All fields are required');
    });

    test('[NEGATIVE] should throw error if price is negative', async () => {
      const invalidData = { productName: 'Laptop', productCategory: 'Electronics', price: -1000, owner: 'seller1' };
      await expect(productsService.createProduct(invalidData)).rejects.toThrow('Price must be greater than 0');
    });

    test('[NEGATIVE] should throw error if owner not found', async () => {
      const productData = { productName: 'Laptop', productCategory: 'Electronics', price: 1000, owner: 'nonexistent' };
      productsRepository.findByName.mockResolvedValue(null);
      usersRepository.findByUsername.mockResolvedValue(null);
      await expect(productsService.createProduct(productData)).rejects.toThrow('Owner not found');
    });

    test('[NEGATIVE] should throw error if product name already exists', async () => {
      const productData = { productName: 'Existing Laptop', productCategory: 'Electronics', price: 15000000, owner: 'seller1' };
      productsRepository.findByName.mockResolvedValue({ id: 1, name: 'Existing Laptop' });
      await expect(productsService.createProduct(productData)).rejects.toThrow('Product name already exists');
    });

    test('[NEGATIVE] should throw error if price is null', async () => {
      const productData = { productName: 'Laptop', productCategory: 'Electronics', price: null, owner: 'seller1' };
      await expect(productsService.createProduct(productData)).rejects.toThrow('All fields are required: productName, productCategory, price, owner');
    });

    test('[NEGATIVE] should throw error if price is undefined', async () => {
      const productData = { productName: 'Laptop', productCategory: 'Electronics', price: undefined, owner: 'seller1' };
      await expect(productsService.createProduct(productData)).rejects.toThrow('All fields are required: productName, productCategory, price, owner');
    });
  });

  describe('getAllProducts', () => {
    test('[POSITIVE] should return all products', async () => {
      const mockProducts = [{ name: 'Product 1', price: 10000 }, { name: 'Product 2', price: 20000 }];
      productsRepository.findAll.mockResolvedValue(mockProducts);

      const result = await productsService.getAllProducts();

      expect(result).toEqual(mockProducts);
    });
  });

  describe('getProductsByOwner', () => {
    test('[POSITIVE] should return products for a given owner', async () => {
      const owner = { id: 1, username: 'seller1' };
      const mockProducts = [{ name: 'Product 1', ownerId: 1 }, { name: 'Product 2', ownerId: 1 }];
      usersRepository.findByUsername.mockResolvedValue(owner);
      productsRepository.findByOwner.mockResolvedValue(mockProducts);

      const result = await productsService.getProductsByOwner('seller1');

      expect(result).toEqual(mockProducts);
      expect(usersRepository.findByUsername).toHaveBeenCalledWith('seller1');
      expect(productsRepository.findByOwner).toHaveBeenCalledWith(1);
    });

    test('[NEGATIVE] should throw error if owner not found', async () => {
      usersRepository.findByUsername.mockResolvedValue(null);
      await expect(productsService.getProductsByOwner('nonexistent')).rejects.toThrow('Owner not found');
    });
  });

  describe('getProductByName', () => {
    test('[POSITIVE] should return the product when found', async () => {
      const mockProduct = { name: 'Laptop', price: 15000000 };
      productsRepository.findByName.mockResolvedValue(mockProduct);
      const result = await productsService.getProductByName('Laptop');
      expect(result).toEqual(mockProduct);
      expect(productsRepository.findByName).toHaveBeenCalledWith('Laptop');
    });

    test('[NEGATIVE] should throw an error if product not found', async () => {
      productsRepository.findByName.mockResolvedValue(null);
      await expect(productsService.getProductByName('Non Existent Product')).rejects.toThrow('Product not found');
    });
  });
});
