import { CustomerRole, PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/auth.js";
import { generateTableQrCode } from "../src/services/qrCodeService.js";

const prisma = new PrismaClient();

async function upsertProduct(categoryId: string, name: string, description: string, price: number, imageUrl: string) {
  const existing = await prisma.product.findFirst({ where: { name, categoryId } });
  if (existing) return prisma.product.update({ where: { id: existing.id }, data: { description, price, imageUrl, available: true } });
  return prisma.product.create({ data: { name, description, price, imageUrl, categoryId } });
}

async function main() {
  const restaurant = await prisma.restaurant.upsert({ where: { id: "00000000-0000-4000-8000-000000000001" }, update: {}, create: { id: "00000000-0000-4000-8000-000000000001", name: "SmartMenu Bistro", address: "42 Market Street" } });

  const breakfast = await prisma.category.upsert({ where: { restaurantId_name: { restaurantId: restaurant.id, name: "Breakfast" } }, update: {}, create: { name: "Breakfast", restaurantId: restaurant.id } });
  const lunch = await prisma.category.upsert({ where: { restaurantId_name: { restaurantId: restaurant.id, name: "Lunch" } }, update: {}, create: { name: "Lunch", restaurantId: restaurant.id } });
  const drinks = await prisma.category.upsert({ where: { restaurantId_name: { restaurantId: restaurant.id, name: "Drinks" } }, update: {}, create: { name: "Drinks", restaurantId: restaurant.id } });

  await Promise.all([
    upsertProduct(breakfast.id, "Avocado Toast", "Sourdough, avocado mash, cherry tomatoes, and chili flakes.", 9.5, "https://images.unsplash.com/photo-1603046891744-1f76eb10aec1?auto=format&fit=crop&w=900&q=80"),
    upsertProduct(breakfast.id, "Berry Oat Bowl", "Warm oats with seasonal berries, maple, and toasted almonds.", 8.25, "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=900&q=80"),
    upsertProduct(lunch.id, "Grilled Halloumi Salad", "Greens, roasted peppers, cucumber, herbs, and lemon dressing.", 12.75, "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80"),
    upsertProduct(lunch.id, "Chicken Pesto Panini", "Toasted ciabatta with chicken, pesto, mozzarella, and arugula.", 11.9, "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80"),
    upsertProduct(drinks.id, "Iced Matcha Latte", "Ceremonial matcha, milk, vanilla, and ice.", 5.5, "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80"),
    upsertProduct(drinks.id, "House Lemonade", "Fresh lemon, mint, sparkling water, and cane sugar.", 4.75, "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80")
  ]);

  for (const number of [1, 2, 3, 4, 5, 6]) {
    const table = await prisma.table.upsert({ where: { restaurantId_number: { restaurantId: restaurant.id, number } }, update: {}, create: { number, restaurantId: restaurant.id, qrCode: "generating" } });
    await prisma.table.update({ where: { id: table.id }, data: { qrCode: await generateTableQrCode(table.id) } });
  }

  await prisma.customer.upsert({ where: { email: "admin@smartmenu.ai" }, update: {}, create: { email: "admin@smartmenu.ai", passwordHash: await hashPassword("Password123!"), role: CustomerRole.ADMIN } });
  await prisma.customer.upsert({ where: { email: "guest@smartmenu.ai" }, update: {}, create: { email: "guest@smartmenu.ai", passwordHash: await hashPassword("Password123!") } });
}

main().then(async () => prisma.$disconnect()).catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });
