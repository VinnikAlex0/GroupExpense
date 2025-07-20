import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  {
    name: "Food & Dining",
    description: "Restaurants, groceries, snacks, and beverages",
    icon: "utensils",
    color: "#ff6b6b",
  },
  {
    name: "Transportation",
    description: "Gas, public transport, rideshares, and parking",
    icon: "car",
    color: "#4ecdc4",
  },
  {
    name: "Accommodation",
    description: "Hotels, Airbnb, camping, and lodging",
    icon: "bed",
    color: "#45b7d1",
  },
  {
    name: "Entertainment",
    description: "Movies, concerts, games, and activities",
    icon: "gamepad",
    color: "#f7b801",
  },
  {
    name: "Shopping",
    description: "Clothing, electronics, and general purchases",
    icon: "shopping-bag",
    color: "#6c5ce7",
  },
  {
    name: "Utilities",
    description: "Bills, internet, phone, and subscriptions",
    icon: "zap",
    color: "#fd79a8",
  },
  {
    name: "Healthcare",
    description: "Medical expenses, pharmacy, and insurance",
    icon: "heart",
    color: "#00b894",
  },
  {
    name: "Travel",
    description: "Flights, visas, travel insurance, and tours",
    icon: "plane",
    color: "#0984e3",
  },
  {
    name: "Groceries",
    description: "Supermarket shopping and household items",
    icon: "shopping-cart",
    color: "#00cec9",
  },
  {
    name: "Other",
    description: "Miscellaneous expenses",
    icon: "more-horizontal",
    color: "#636e72",
  },
];

async function main() {
  console.log("🌱 Seeding database with default categories...");

  // Delete existing categories if any
  await prisma.category.deleteMany({
    where: { isDefault: true },
  });

  // Create default categories
  for (const category of defaultCategories) {
    await prisma.category.create({
      data: {
        ...category,
        isDefault: true,
      },
    });
  }

  console.log("✅ Successfully seeded database with default categories!");
  console.log(
    `📊 Created ${defaultCategories.length} default expense categories`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
