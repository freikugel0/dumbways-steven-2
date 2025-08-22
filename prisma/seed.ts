import { prisma } from "../src/lib/client.js";

async function main() {
  await prisma.user.deleteMany();

  // Seed Users
  const userNames = [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
    "Grace",
  ];
  const users = await Promise.all(
    userNames.map((name, i) =>
      prisma.user.create({
        data: {
          name,
          email: `${name.toLowerCase()}${i}@gmail.com`,
          points: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
        },
      }),
    ),
  );

  console.log("✅ Seeding complete with:");
  console.log(`- ${users.length} users`);
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
