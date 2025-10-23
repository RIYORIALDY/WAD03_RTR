const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const usersData = require('./data/users.json');
const productsData = require('./data/products.json');
const cartsData = require('./data/carts.json');

async function main() {
  console.log('Start seeding...');

  // Seed users
  for (const u of usersData) {
    await prisma.user.create({
      data: u,
    });
  }
  console.log('Users seeded.');

  // Seed products
  for (const p of productsData) {
    const owner = await prisma.user.findUnique({ where: { username: p.owner } });
    if (owner) {
      await prisma.product.create({
        data: {
          name: p.productName,
          category: p.productCategory,
          price: p.price,
          ownerId: owner.id,
        },
      });
    }
  }
  console.log('Products seeded.');

  // Seed carts and cart items
  for (const c of cartsData) {
    const user = await prisma.user.findUnique({ where: { username: c.username } });
    if (user) {
      const cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });

      for (const item of c.items) {
        const product = await prisma.product.findFirst({
          where: {
            name: item.productName,
            category: item.productCategory,
            price: item.price,
          },
        });
        if (product) {
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId: product.id,
              quantity: item.quantity,
            },
          });
        }
      }
    }
  }
  console.log('Carts and cart items seeded.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
