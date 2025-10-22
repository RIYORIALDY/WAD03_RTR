const { describe, test, expect, beforeEach } = require('@jest/globals');

/**
 * Unit Test untuk Users Controller
 */

// Mock service
const mockUsersService = {
  createUser: jest.fn(),
  getAllUsers: jest.fn(),
  getUserByUsername: jest.fn(),
};

jest.mock('../services/usersService', () => mockUsersService);

const usersController = require('../controllers/usersController');

describe('Users Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createUser', () => {
    test('[POSITIVE] should create user and return 201', async () => {
      // Arrange
      req.body = {
        username: 'testuser',
        name: 'Test User',
        email: 'test@test.com',
        role: 'buyer'
      };
      mockUsersService.createUser.mockResolvedValue(req.body);

      // Act
      await usersController.createUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        data: req.body
      });
    });

    test('[NEGATIVE] should return 400 on error', async () => {
      // Arrange
      req.body = { username: '' };
      mockUsersService.createUser.mockRejectedValue(new Error('Validation error'));

      // Act
      await usersController.createUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Validation error' });
    });
  });

  describe('getAllUsers', () => {
    test('[POSITIVE] should return all users with 200', async () => {
      // Arrange
      const mockUsers = [
        { username: 'user1', name: 'User 1' },
        { username: 'user2', name: 'User 2' }
      ];
      mockUsersService.getAllUsers.mockResolvedValue(mockUsers);

      // Act
      await usersController.getAllUsers(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Users retrieved successfully',
        data: mockUsers
      });
    });

    test('[NEGATIVE] should return 500 on error', async () => {
      // Arrange
      mockUsersService.getAllUsers.mockRejectedValue(new Error('Database error'));

      // Act
      await usersController.getAllUsers(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('getUserByUsername', () => {
    test('[POSITIVE] should return user with 200', async () => {
      // Arrange
      req.params.username = 'testuser';
      const mockUser = { username: 'testuser', name: 'Test User' };
      mockUsersService.getUserByUsername.mockResolvedValue(mockUser);

      // Act
      await usersController.getUserByUsername(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User retrieved successfully',
        data: mockUser
      });
    });

    test('[NEGATIVE] should return 404 when user not found', async () => {
      // Arrange
      req.params.username = 'nonexistent';
      mockUsersService.getUserByUsername.mockRejectedValue(new Error('User not found'));

      // Act
      await usersController.getUserByUsername(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });
});
