const { describe, test, expect, beforeEach } = require('@jest/globals');
const usersController = require('../controllers/usersController');
const usersService = require('../services/usersService');

jest.mock('../services/usersService', () => ({
  createUser: jest.fn(),
  getAllUsers: jest.fn(),
  getUserByUsername: jest.fn(),
}));

describe('Users Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createUser', () => {
    test('[POSITIVE] should create user and return 201', async () => {
      req.body = { username: 'testuser', name: 'Test User', email: 'test@test.com', role: 'buyer' };
      usersService.createUser.mockResolvedValue(req.body);

      await usersController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully', data: req.body });
    });

    test('[NEGATIVE] should return 400 on error', async () => {
      req.body = { username: '' };
      usersService.createUser.mockRejectedValue(new Error('Validation error'));

      await usersController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Validation error' });
    });
  });

  describe('getAllUsers', () => {
    test('[POSITIVE] should return all users with 200', async () => {
      const mockUsers = [{ username: 'user1', name: 'User 1' }, { username: 'user2', name: 'User 2' }];
      usersService.getAllUsers.mockResolvedValue(mockUsers);

      await usersController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Users retrieved successfully', data: mockUsers });
    });

    test('[NEGATIVE] should return 500 on error', async () => {
      usersService.getAllUsers.mockRejectedValue(new Error('Database error'));

      await usersController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('getUserByUsername', () => {
    test('[POSITIVE] should return user with 200', async () => {
      req.params.username = 'testuser';
      const mockUser = { username: 'testuser', name: 'Test User' };
      usersService.getUserByUsername.mockResolvedValue(mockUser);

      await usersController.getUserByUsername(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User retrieved successfully', data: mockUser });
    });

    test('[NEGATIVE] should return 404 when user not found', async () => {
      req.params.username = 'nonexistent';
      usersService.getUserByUsername.mockRejectedValue(new Error('User not found'));

      await usersController.getUserByUsername(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });
});
