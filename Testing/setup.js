/**
 * Setup file untuk Jest Testing
 * File ini akan di-load sebelum semua test dijalankan
 */

// Set environment untuk testing
process.env.NODE_ENV = 'test';

// Mock console untuk mengurangi noise saat testing
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Timeout untuk async operations - increased for MongoDB operations
jest.setTimeout(30000);
