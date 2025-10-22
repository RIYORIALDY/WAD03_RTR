const mongoose = require('mongoose');

// MongoDB Connection URL - bisa diganti sesuai kebutuhan
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_wad03';

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      if (this.connection) {
        console.log('Database sudah terkoneksi');
        return this.connection;
      }

      // Removed deprecated options: useNewUrlParser and useUnifiedTopology
      this.connection = await mongoose.connect(MONGODB_URI);

      console.log('✅ Database MongoDB berhasil terkoneksi ke:', MONGODB_URI);
      return this.connection;
    } catch (error) {
      console.error('❌ Error koneksi database:', error.message);
      throw error;
    }
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
      this.connection = null;
      console.log('Database terputus');
    } catch (error) {
      console.error('Error saat disconnect database:', error.message);
      throw error;
    }
  }

  getConnection() {
    return mongoose.connection;
  }
}

module.exports = new Database();
