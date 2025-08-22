import { PrismaClient } from "./generated/prisma";

const globalWithPrisma = global as typeof globalThis & { prisma: PrismaClient };

if (process.env.NODE_ENV !== 'production' && !globalWithPrisma.prisma) {
  globalWithPrisma.prisma = new PrismaClient();
}

const prisma = process.env.NODE_ENV === 'production' ? new PrismaClient() : globalWithPrisma.prisma;
export default prisma;

// globalThis.prisma: This global variable ensures that the Prisma client instance is reused across hot reloads during development. 
// Without this, each time your application reloads, a new instance of the Prisma client would be created, potentially leading to connection issues.