import { prisma } from "../src/lib/client.js";

async function main() {
  // Clear existing data
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();

  // Supplier + Product data (English names)
  const supplierData = [
    {
      name: "Supplier A",
      products: [
        { name: "Instant Noodles", stock: 50 },
        { name: "Coffee Sachet", stock: 30 },
      ],
    },
    {
      name: "Supplier B",
      products: [
        { name: "Cooking Oil", stock: 100 },
        { name: "Wheat Flour", stock: 75 },
      ],
    },
    {
      name: "Supplier C",
      products: [{ name: "Milk Powder", stock: 40 }],
    },
  ];

  // Seed Suppliers + Products
  const suppliers = await Promise.all(
    supplierData.map((supplier) =>
      prisma.supplier.create({
        data: {
          name: supplier.name,
          products: {
            create: supplier.products,
          },
        },
        include: { products: true },
      }),
    ),
  );

  console.log("✅ Seeding complete with:");
  console.log(`- ${suppliers.length} suppliers`);
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
