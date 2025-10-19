const { describe, test, expect, beforeEach } = require('@jest/globals');

/**
 * Unit Test untuk Users Service
 * Testing Pattern: AAA (Arrange, Act, Assert)
 */

// Mock repository untuk isolasi unit test
const mockUsersRepository = {
  findAll: jest.fn(),
  findByUsername: jest.fn(),
  save: jest.fn(),
  exists: jest.fn(),
}; 

// Mock module sebelum import service
jest.mock('../repositories/usersRepository', () => mockUsersRepository);

const usersService = require('../services/usersService');

describe('Users Service - Unit Tests', () => {
  // Reset semua mock sebelum setiap test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    test('[POSITIVE] should create user successfully dengan data valid', () => {
      // Arrange
      const userData = {
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        role: 'buyer'
      };
      
      mockUsersRepository.exists.mockReturnValue(false);
      mockUsersRepository.save.mockReturnValue(userData);

      // Act
      const result = usersService.createUser(userData);

      // Assert
      expect(result).toEqual(userData);
      expect(mockUsersRepository.exists).toHaveBeenCalledWith('testuser');
      expect(mockUsersRepository.save).toHaveBeenCalledWith(userData);
    });

    test('[NEGATIVE] should throw error jika username kosong', () => {
      // Arrange
      const invalidData = {
        username: '',
        name: 'Test User',
        email: 'test@example.com',
        role: 'buyer'
      };

      // Act & Assert
      expect(() => {
        usersService.createUser(invalidData);
      }).toThrow('All fields are required: username, name, email, role');
    });

    test('[NEGATIVE] should throw error jika role tidak valid', () => {
      // Arrange
      const invalidData = {
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin' // role tidak valid
      };

      // Act & Assert
      expect(() => {
        usersService.createUser(invalidData);
      }).toThrow('Role must be either "buyer" or "seller"');
    });

    test('[NEGATIVE] should throw error jika username sudah ada', () => {
      // Arrange
      const userData = {
        username: 'existinguser',
        name: 'Test User',
        email: 'test@example.com',
        role: 'buyer'
      };
      
      mockUsersRepository.exists.mockReturnValue(true);

      // Act & Assert
      expect(() => {
        usersService.createUser(userData);
      }).toThrow('Username already exists');
    });

    test('[BOUNDARY] should throw error jika email tidak ada', () => {
      // Arrange
      const invalidData = {
        username: 'testuser',
        name: 'Test User',
        email: '',
        role: 'buyer'
      };

      // Act & Assert
      expect(() => {
        usersService.createUser(invalidData);
      }).toThrow('All fields are required: username, name, email, role');
    });
  });

  describe('getAllUsers', () => {
    test('[POSITIVE] should return semua users', () => {
      // Arrange
      const mockUsers = [
        { username: 'user1', name: 'User One', email: 'user1@example.com', role: 'buyer' },
        { username: 'user2', name: 'User Two', email: 'user2@example.com', role: 'seller' }
      ];
      
      mockUsersRepository.findAll.mockReturnValue(mockUsers);

      // Act
      const result = usersService.getAllUsers();

      // Assert
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
      expect(mockUsersRepository.findAll).toHaveBeenCalledTimes(1);
    });

    test('[BOUNDARY] should return empty array jika tidak ada users', () => {
      // Arrange
      mockUsersRepository.findAll.mockReturnValue([]);

      // Act
      const result = usersService.getAllUsers();

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('getUserByUsername', () => {
    test('[POSITIVE] should return user jika ditemukan', () => {
      // Arrange
      const mockUser = {
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        role: 'buyer'
      };
      
      mockUsersRepository.findByUsername.mockReturnValue(mockUser);

      // Act
      const result = usersService.getUserByUsername('testuser');

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockUsersRepository.findByUsername).toHaveBeenCalledWith('testuser');
    });

    test('[NEGATIVE] should throw error jika user tidak ditemukan', () => {
      // Arrange
      mockUsersRepository.findByUsername.mockReturnValue(null);

      // Act & Assert
      expect(() => {
        usersService.getUserByUsername('nonexistent');
      }).toThrow('User not found');
    });
  });
});