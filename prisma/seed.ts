import { prisma } from "../src/lib/client.js";

async function main() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  const [alice, bob, charlie] = await Promise.all([
    prisma.user.create({
      data: { name: "Alice", email: "alice123@gmail.com" },
    }),
    prisma.user.create({ data: { name: "Bob", email: "bob123@gmail.com" } }),
    prisma.user.create({
      data: { name: "Charlie", email: "charlie123@gmail.com" },
    }),
  ]);

  // Seed Products
  const [laptop, headphones, keyboard] = await Promise.all([
    prisma.product.create({
      data: { name: "Laptop", price: 15000000.0, stock: 10 },
    }),
    prisma.product.create({
      data: { name: "Headphones", price: 200000.0, stock: 30 },
    }),
    prisma.product.create({
      data: { name: "Keyboard", price: 350000.0, stock: 50 },
    }),
  ]);
  // Seed Order
  await prisma.order.createMany({
    data: [
      { userId: alice.id, productId: laptop.id, qty: 1 },
      { userId: alice.id, productId: headphones.id, qty: 2 },
      { userId: bob.id, productId: keyboard.id, qty: 5 },
      { userId: charlie.id, productId: laptop.id, qty: 1 },
    ],
  });

  console.log("Seeding complete!");
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
