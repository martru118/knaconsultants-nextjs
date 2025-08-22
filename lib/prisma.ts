import { PrismaClient } from "./generated/prisma";

const globalWithPrisma = global as typeof globalThis & { prisma: PrismaClient };

if (process.env.NODE_ENV !== 'production' && !globalWithPrisma.prisma) {
  globalWithPrisma.prisma = new PrismaClient();
}

const db = process.env.NODE_ENV === 'production' ? new PrismaClient() : globalWithPrisma.prisma;
export default db;

// globalWithPrisma.prisma: This global variable ensures that the Prisma client instance is reused across hot reloads during development. 
// Without this, each time your application reloads, a new instance of the Prisma client would be created, potentially leading to connection issues.