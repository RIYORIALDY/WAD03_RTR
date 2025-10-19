# 🚀 Quick Start Guide - WAD03_RTR

## Prerequisites
- Node.js installed
- MongoDB installed and running (atau MongoDB Atlas)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Check Environment Variables
File `.env` sudah ada dengan configuration default:
```
MONGODB_URI=mongodb://localhost:27017/ecommerce_wad03
PORT=3000
NODE_ENV=development
```

### 3. Seed Database (Optional)
Populate database dengan data dari JSON files:
```bash
npm run seed
```

Output yang diharapkan:
```
✅ Connected to MongoDB
✅ Existing data cleared
✅ 3 users seeded
✅ 1 products seeded
✅ 2 carts seeded
🎉 Database seeding completed successfully!
```

### 4. Run Tests
Verifikasi bahwa semua tests passing:
```bash
npm test
```

Output yang diharapkan:
```
PASS Testing/usersService.test.js
PASS Testing/productsService.test.js
PASS Testing/cartService.test.js

Test Suites: 3 passed, 3 total
Tests:       27 passed, 27 total
```

### 5. Start Application
```bash
npm run dev
```

Server akan running di: `http://localhost:3000`

## Testing API Endpoints

### Test dengan curl:

#### 1. Get All Users
```bash
curl http://localhost:3000/users
```

#### 2. Create New User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "name": "New User",
    "email": "newuser@example.com",
    "role": "buyer"
  }'
```

#### 3. Get All Products
```bash
curl http://localhost:3000/products
```

#### 4. Get Cart by Username
```bash
curl http://localhost:3000/carts/rayen_buyer
```

## Project Structure

```
/app/
├── models/           # Mongoose schemas (User, Product, Cart)
├── repositories/     # Database operations
├── services/        # Business logic
├── controllers/     # Request handlers
├── routes/          # API routes
├── middleware/      # Custom middleware
├── Testing/         # Jest unit tests
├── data/            # Initial JSON data
├── database.js      # Database connection
├── server.js        # Main entry point
└── seedDatabase.js  # Seeding script
```

## Available Scripts

- `npm start` - Run production server
- `npm run dev` - Run development server (with auto-reload)
- `npm test` - Run all tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run seed` - Seed database with initial data

## Key Features

✅ **Database Integration**: MongoDB dengan Mongoose ODM
✅ **Testing**: Jest.js unit tests dengan 27 test cases
✅ **MVC Architecture**: Clean separation of concerns
✅ **API Endpoints**: RESTful API design
✅ **Validation**: Input validation di model level
✅ **Error Handling**: Comprehensive error handling

## Troubleshooting

### MongoDB Connection Error
Pastikan MongoDB service running:
```bash
# Check MongoDB status
systemctl status mongod

# Start MongoDB
systemctl start mongod
```

### Port Already in Use
Change PORT di `.env` file atau kill existing process:
```bash
# Find process on port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)
```

### Tests Failing
Clear jest cache:
```bash
npx jest --clearCache
npm test
```

## Documentation

- [README.md](README.md) - Full documentation
- [Testing/README.md](Testing/README.md) - Testing documentation
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Implementation details

## Support

Untuk pertanyaan atau issues, hubungi:
- RIYO RIALDY URDA
- RAYEN AURILIANSYAH  
- MUHAMMAD TAQI DZAKWAN

---
**Happy Coding! 🎉**
