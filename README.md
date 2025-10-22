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
