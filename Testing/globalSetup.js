const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async function globalSetup() {
  try {
    // Create in-memory MongoDB server
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    // Store the URI and instance globally
    global.__MONGOD__ = mongod;
    process.env.MONGODB_URI = uri;
    
    console.log('✅ MongoDB Memory Server started successfully');
  } catch (error) {
    console.error('⚠️  Failed to start MongoDB Memory Server:', error.message);
    // Fallback
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/test_fallback';
  }
};
