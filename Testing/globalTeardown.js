module.exports = async function globalTeardown() {
  // Stop the in-memory MongoDB server
  if (global.__MONGOD__) {
    await global.__MONGOD__.stop();
    console.log('MongoDB Memory Server stopped');
  }
};
