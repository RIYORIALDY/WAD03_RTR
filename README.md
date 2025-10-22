# 🛒 ECommerce Web Application - WAD03_RTR

ECommerce Web Application dengan arsitektur MVC (Model-View-Controller) menggunakan Node.js, Express, dan MongoDB.

## 👥 Team Members
- RIYO RIALDY URDA
- RAYEN AURILIANSYAH  
- MUHAMMAD TAQI DZAKWAN

## 🏗️ Architecture

Aplikasi ini menggunakan **MVC Architecture Pattern** dengan struktur sebagai berikut:

```
/app/
├── models/              # Database Models (Mongoose Schemas)
│   ├── User.js         # User model
│   ├── Product.js      # Product model
│   └── Cart.js         # Cart model
├── repositories/        # Data Access Layer
│   ├── usersRepository.js
│   ├── productsRepository.js
│   └── cartRepository.js
├── services/           # Business Logic Layer
│   ├── usersService.js
│   ├── productsService.js
│   └── cartService.js
├── controllers/        # Request Handlers
│   ├── usersController.js
│   ├── productsController.js
│   └── cartController.js
├── routes/            # API Routes
│   ├── usersRoutes.js
│   ├── productsRoute.js
│   └── cartRoute.js
├── middleware/        # Custom Middlewares
│   ├── buyerOnly.js
│   └── sellerOnly.js
├── Testing/           # Unit Tests (Jest.js)
│   ├── usersService.test.js
│   ├── productsService.test.js
│   ├── cartService.test.js
│   └── setup.js
├── data/              # Initial JSON data
├── database.js        # Database connection setup
├── seedDatabase.js    # Database seeding script
├── server.js          # Main application entry point
└── package.json       # Dependencies and scripts
```

## 🔧 Tech Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Testing**: Jest.js
- **Dev Tools**: Nodemon

## 📦 Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd WAD03_RTR
```

2. **Install dependencies**
```bash
npm install
# atau
yarn install
```

3. **Setup environment variables**
```bash
# .env file sudah tersedia dengan konfigurasi default
# Edit jika perlu mengubah MongoDB URI atau PORT
```

4. **Pastikan MongoDB running**
```bash
# Jika pakai MongoDB local, pastikan service running
# Atau bisa pakai MongoDB Atlas (cloud)
```

## 🚀 Running the Application

### Development Mode (dengan auto-reload)
```bash
npm run dev
# atau
yarn dev
```

### Production Mode
```bash
npm start
# atau
yarn start
```

Server akan berjalan di `http://localhost:3000`

## 🌱 Database Seeding

Untuk mengisi database dengan data initial dari JSON files:

```bash
npm run seed
# atau
yarn seed
```

Script ini akan:
1. Clear existing data di database
2. Import users dari `data/users.json`
3. Import products dari `data/products.json`
4. Import carts dari `data/carts.json`

## 🧪 Testing

### Run All Tests
```bash
npm test
# atau
yarn test
```
### Run Tests FAIL

<img width="940" height="598" alt="Image" src="https://github.com/user-attachments/assets/aba97656-2661-428e-8a53-ebe439b4636f" />

<img width="940" height="492" alt="Image" src="https://github.com/user-attachments/assets/6f489c84-2d12-41be-97a1-576c1bc7af12" />


### Run Tests PASS

<img width="282" height="176" alt="Image" src="https://github.com/user-attachments/assets/e23538a0-54ca-4250-8a47-a051541fc6f9" />


<img width="879" height="163" alt="Image" src="https://github.com/user-attachments/assets/a7c26c18-f0e2-4ec9-a794-40ad1409e8c5" />


### Run Tests dengan Watch Mode
```bash
npm run test:watch
# atau
yarn test:watch
```

### Run Tests dengan Coverage Report
```bash
npm test -- --coverage
# atau
yarn test --coverage
```

Testing menggunakan **Jest.js** dengan:
- ✅ Unit tests untuk semua services
- ✅ Mocking external dependencies
- ✅ AAA pattern (Arrange, Act, Assert)
- ✅ Coverage untuk positive, negative, dan boundary cases

Lihat dokumentasi lengkap di [Testing/README.md](Testing/README.md)

## 📊 Database Schema

### User Schema
```javascript
{
  username: String (required, unique),
  name: String (required),
  email: String (required),
  role: String (enum: ['buyer', 'seller']),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
  productName: String (required),
  productCategory: String (required),
  price: Number (required, min: 0),
  owner: String (required, ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Schema
```javascript
{
  username: String (required, unique, ref: 'User'),
  items: [{
    productName: String,
    productCategory: String,
    price: Number,
    quantity: Number
  }],
  totalItems: Number,
  totalPrice: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Users API
- `GET /users` - Get all users
- `GET /users/:username` - Get user by username
- `POST /users` - Create new user

### Products API
- `GET /products` - Get all products
- `GET /products/owner/:owner` - Get products by owner
- `POST /products` - Create new product (seller only)

### Cart API
- `GET /carts/:username` - Get cart by username
- `POST /carts/:username/items` - Add item to cart (buyer only)
- `DELETE /carts/:username/items/:productName` - Remove item from cart
- `DELETE /carts/:username` - Clear cart

## 🔐 Middleware

- **buyerOnly.js** - Restrict access untuk buyer saja
- **sellerOnly.js** - Restrict access untuk seller saja

## 📝 File Descriptions

### database.js
File untuk setup dan manage koneksi ke MongoDB database.

### seedDatabase.js
Script untuk populate database dengan initial data dari JSON files.

### models/
Berisi Mongoose schemas yang define struktur data di MongoDB.

### repositories/
Data Access Layer - handle semua operasi database (CRUD operations).

### services/
Business Logic Layer - contain business rules dan validations.

### controllers/
Request Handlers - handle HTTP requests dan responses.

### Testing/
Unit tests menggunakan Jest.js untuk ensure code quality.

## 🎯 Features

✅ User Management (Buyer & Seller)
✅ Product Management
✅ Shopping Cart System
✅ Role-based Access Control
✅ Input Validation
✅ Error Handling
✅ Unit Testing
✅ Database Integration (MongoDB)
✅ RESTful API Design

## 🛠️ Development

### Code Structure
- **MVC Pattern**: Separation of concerns
- **Repository Pattern**: Abstraction untuk database operations
- **Service Layer**: Business logic isolation
- **Middleware**: Reusable request processing

### Best Practices
- ✅ Consistent naming conventions
- ✅ Error handling di setiap layer
- ✅ Input validation
- ✅ Async/await untuk database operations
- ✅ Mock dependencies untuk testing
- ✅ Code documentation


## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests: `npm test`
4. Commit changes
5. Push to branch
6. Create Pull Request

## 📄 License

ISC License - WAD03_RTR Team

## 📞 Support

Untuk pertanyaan atau issues, hubungi team members.

---

**Dibuat dengan ❤️ oleh WAD03_RTR Team**
