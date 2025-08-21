import { prisma } from "../src/lib/client.js";

const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

async function main() {
  // Bersihin dulu data lama
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
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
        },
      }),
    ),
  );

  // Seed Categories
  const categoryNames = ["Tech", "Lifestyle", "Education", "Travel", "Food"];
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.create({
        data: { name },
      }),
    ),
  );

  // Seed Posts
  const posts: any[] = [];
  for (let i = 1; i <= 20; i++) {
    const post = await prisma.post.create({
      data: {
        title: `Post #${i} - ${random(["Tips", "Guide", "Story", "Review"])}`,
        content: `This is the content of post number ${i}.`,
        authorId: random(users).id,
        categoryId: random(categories).id,
      },
    });
    posts.push(post);
  }

  // Seed Comments
  const commentsData = [];
  for (let i = 1; i <= 100; i++) {
    commentsData.push({
      content: `Comment #${i} lorem ipsum...`,
      userId: random(users).id,
      postId: random(posts).id,
    });
  }
  await prisma.comment.createMany({ data: commentsData });

  console.log("✅ Seeding complete with:");
  console.log(`- ${users.length} users`);
  console.log(`- ${categories.length} categories`);
  console.log(`- ${posts.length} posts`);
  console.log(`- ${commentsData.length} comments`);
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
