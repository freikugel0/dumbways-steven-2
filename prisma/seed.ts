import { prisma } from "../src/lib/client.js";

const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

async function main() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  const users = await Promise.all([
    prisma.user.create({ data: { name: "Alice", email: "alice@example.com" } }),
    prisma.user.create({ data: { name: "Bob", email: "bob@example.com" } }),
    prisma.user.create({
      data: { name: "Charlie", email: "charlie@example.com" },
    }),
    prisma.user.create({ data: { name: "Diana", email: "diana@example.com" } }),
    prisma.user.create({ data: { name: "Eve", email: "eve@example.com" } }),
  ]);

  // Seed Products
  const products = await Promise.all([
    prisma.product.create({
      data: { name: "Laptop", price: 15000000, stock: 20 },
    }),
    prisma.product.create({
      data: { name: "Headphones", price: 200000, stock: 50 },
    }),
    prisma.product.create({
      data: { name: "Keyboard", price: 350000, stock: 40 },
    }),
    prisma.product.create({
      data: { name: "Mouse", price: 150000, stock: 100 },
    }),
    prisma.product.create({
      data: { name: "Monitor", price: 3000000, stock: 15 },
    }),
  ]);

  // Seed Orders
  const orders = [];
  for (let i = 0; i < 30; i++) {
    orders.push({
      userId: random(users).id,
      productId: random(products).id,
      qty: Math.floor(Math.random() * 5) + 1, // antara 1 - 5
    });
  }

  await prisma.order.createMany({ data: orders });

  console.log("✅ Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
