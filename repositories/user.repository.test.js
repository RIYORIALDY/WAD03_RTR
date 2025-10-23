const { describe, test, expect, beforeEach } = require('@jest/globals');
const usersRepository = require('./usersRepository');
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('Users Repository - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    test('[POSITIVE] should return all users', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', name: 'User One', email: 'user1@test.com', role: 'buyer' },
        { id: 2, username: 'user2', name: 'User Two', email: 'user2@test.com', role: 'seller' },
      ];
      prisma.user.findMany.mockResolvedValue(mockUsers);

      const result = await usersRepository.findAll();

      expect(result).toHaveLength(2);
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });

    test('[BOUNDARY] should return empty array when no users', async () => {
      prisma.user.findMany.mockResolvedValue([]);

      const result = await usersRepository.findAll();

      expect(result).toEqual([]);
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByUsername', () => {
    test('[POSITIVE] should find user by username', async () => {
      const mockUser = { id: 1, username: 'testuser', name: 'Test User', email: 'test@test.com', role: 'buyer' };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await usersRepository.findByUsername('testuser');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username: 'testuser' } });
    });

    test('[NEGATIVE] should return null when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await usersRepository.findByUsername('nonexistent');

      expect(result).toBeNull();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username: 'nonexistent' } });
    });
  });

  describe('save', () => {
    test('[POSITIVE] should save new user', async () => {
      const userData = { username: 'newuser', name: 'New User', email: 'new@test.com', role: 'buyer' };
      const mockSavedUser = { id: 1, ...userData };
      prisma.user.create.mockResolvedValue(mockSavedUser);

      const result = await usersRepository.save(userData);

      expect(result).toEqual(mockSavedUser);
      expect(prisma.user.create).toHaveBeenCalledWith({ data: userData });
    });
  });

  describe('exists', () => {
    test('[POSITIVE] should return true if user exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, username: 'existing' });

      const result = await usersRepository.exists('existing');

      expect(result).toBe(true);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username: 'existing' } });
    });

    test('[NEGATIVE] should return false if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await usersRepository.exists('nonexistent');

      expect(result).toBe(false);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username: 'nonexistent' } });
    });
  });
});
