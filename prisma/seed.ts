import { prisma } from "../src/lib/client.js";

async function main() {
  // Clear existing data
  await prisma.supplierStock.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();

  // Create Suppliers
  await prisma.supplier.createMany({
    data: [
      { name: "Supplier A" },
      { name: "Supplier B" },
      { name: "Supplier C" },
    ],
  });

  // Create Products
  await prisma.product.createMany({
    data: [
      { name: "Instant Noodles" },
      { name: "Cooking Oil" },
      { name: "Wheat Flour" },
      { name: "Milk Powder" },
    ],
  });

  // Insert SupplierStock (relation + stock amount)
  await prisma.supplierStock.createMany({
    data: [
      // Instant Noodles (productId: 1)
      { supplierId: 1, productId: 1, stock: 100 },
      { supplierId: 2, productId: 1, stock: 80 },

      // Cooking Oil (productId: 2)
      { supplierId: 1, productId: 2, stock: 50 },
      { supplierId: 3, productId: 2, stock: 120 },

      // Wheat Flour (productId: 3)
      { supplierId: 2, productId: 3, stock: 200 },

      // Milk Powder (productId: 4)
      { supplierId: 3, productId: 4, stock: 60 },
    ],
  });

  // Fetch with relation for console log
  const seededSuppliers = await prisma.supplier.findMany({
    include: {
      stocks: {
        include: { product: true },
      },
    },
  });

  console.log("✅ Seeding complete");
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
