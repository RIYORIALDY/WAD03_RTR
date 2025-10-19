const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');

// Data dari JSON files
const usersData = require('./data/users.json');
const productsData = require('./data/products.json');
const cartsData = require('./data/carts.json');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_wad03';

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    console.log('✅ Existing data cleared');

    // Seed Users
    console.log('📝 Seeding users...');
    await User.insertMany(usersData);
    console.log(`✅ ${usersData.length} users seeded`);

    // Seed Products
    console.log('📝 Seeding products...');
    await Product.insertMany(productsData);
    console.log(`✅ ${productsData.length} products seeded`);

    // Seed Carts
    console.log('📝 Seeding carts...');
    for (const cartData of cartsData) {
      const cart = new Cart(cartData);
      cart.calculateTotals();
      await cart.save();
    }
    console.log(`✅ ${cartsData.length} carts seeded`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${usersData.length}`);
    console.log(`   Products: ${productsData.length}`);
    console.log(`   Carts: ${cartsData.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run seeding
seedDatabase();
