import { PrismaClient, type Prisma } from "@prisma/client";
import { resolveRuntimeDatabaseUrl } from "@/lib/db/database-url";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function prismaClientOptions(): Prisma.PrismaClientOptions {
  const url = resolveRuntimeDatabaseUrl();
  const log: Prisma.LogLevel[] = process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];
  const options: Prisma.PrismaClientOptions = { log };
  if (url?.startsWith("postgres")) {
    options.datasources = { db: { url } };
  }
  return options;
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
