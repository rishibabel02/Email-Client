// Use a direct import to the Prisma client instead of going through the db module
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  
  try {
    const user = await prisma.user.create({
      data: {
        emailAddress: "test@gmail.com",
        firstName: "test",
        lastName: "test"
      } 
    });
    
    console.log("User created:", user);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);