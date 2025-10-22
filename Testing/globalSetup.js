const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async function globalSetup() {
  try {
    // Create in-memory MongoDB server
    // Let it auto-detect the best version for the platform
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    // Store the URI and instance globally
    global.__MONGOD__ = mongod;
    process.env.MONGODB_URI = uri;
    
    console.log('✅ MongoDB Memory Server started successfully');
  } catch (error) {
    // Fallback to mock connection if memory server fails
    // Tests will use mongoose mock instead
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test_mock';
    console.log('⚠️  Using mock MongoDB connection for tests');
  }
};
