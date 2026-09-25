import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma 7 uses driver adapters, so constructing the client never opens a
 * connection — the first query does. That lets modules import `prisma` at
 * build time (route data collection) even when DATABASE_URL isn't set yet;
 * a placeholder URL simply never gets queried in that case.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const connectionString =
    process.env.DATABASE_URL ??
    "postgresql://build:build@localhost:5432/build_placeholder";
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
