const { describe, test, expect, beforeEach } = require('@jest/globals');
const usersService = require('../services/usersService');
const usersRepository = require('../repositories/usersRepository');

jest.mock('../repositories/usersRepository', () => ({
  findAll: jest.fn(),
  findByUsername: jest.fn(),
  save: jest.fn(),
  exists: jest.fn(),
}));

describe('Users Service - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    test('[POSITIVE] should create user successfully with valid data', async () => {
      const userData = { username: 'testuser', name: 'Test User', email: 'test@example.com', role: 'buyer' };
      usersRepository.exists.mockResolvedValue(false);
      usersRepository.save.mockResolvedValue(userData);

      const result = await usersService.createUser(userData);

      expect(result).toEqual(userData);
      expect(usersRepository.exists).toHaveBeenCalledWith('testuser');
      expect(usersRepository.save).toHaveBeenCalledWith(userData);
    });

    test('[NEGATIVE] should throw error if username is empty', async () => {
      const invalidData = { username: '', name: 'Test User', email: 'test@example.com', role: 'buyer' };
      await expect(usersService.createUser(invalidData)).rejects.toThrow('All fields are required: username, name, email, role');
    });

    test('[NEGATIVE] should throw error if role is invalid', async () => {
      const invalidData = { username: 'testuser', name: 'Test User', email: 'test@example.com', role: 'admin' };
      await expect(usersService.createUser(invalidData)).rejects.toThrow('Role must be either "buyer" or "seller"');
    });

    test('[NEGATIVE] should throw error if username already exists', async () => {
      const userData = { username: 'existinguser', name: 'Test User', email: 'test@example.com', role: 'buyer' };
      usersRepository.exists.mockResolvedValue(true);
      await expect(usersService.createUser(userData)).rejects.toThrow('Username already exists');
    });
  });

  describe('getAllUsers', () => {
    test('[POSITIVE] should return all users', async () => {
      const mockUsers = [
        { username: 'user1', name: 'User One', email: 'user1@example.com', role: 'buyer' },
        { username: 'user2', name: 'User Two', email: 'user2@example.com', role: 'seller' },
      ];
      usersRepository.findAll.mockResolvedValue(mockUsers);

      const result = await usersService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(usersRepository.findAll).toHaveBeenCalledTimes(1);
    });

    test('[BOUNDARY] should return empty array if no users exist', async () => {
      usersRepository.findAll.mockResolvedValue([]);
      const result = await usersService.getAllUsers();
      expect(result).toEqual([]);
    });
  });

  describe('getUserByUsername', () => {
    test('[POSITIVE] should return user if found', async () => {
      const mockUser = { username: 'testuser', name: 'Test User', email: 'test@example.com', role: 'buyer' };
      usersRepository.findByUsername.mockResolvedValue(mockUser);

      const result = await usersService.getUserByUsername('testuser');

      expect(result).toEqual(mockUser);
      expect(usersRepository.findByUsername).toHaveBeenCalledWith('testuser');
    });

    test('[NEGATIVE] should throw error if user not found', async () => {
      usersRepository.findByUsername.mockResolvedValue(null);
      await expect(usersService.getUserByUsername('nonexistent')).rejects.toThrow('User not found');
    });
  });
});
