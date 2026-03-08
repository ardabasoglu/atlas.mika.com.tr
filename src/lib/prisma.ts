import {
  PrismaClient,
  type PrismaClient as PrismaClientType,
} from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

// When connecting to a real DB, pass adapter or accelerateUrl, e.g.:
// new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })
export const prisma: PrismaClientType =
  globalForPrisma.prisma ??
  (new PrismaClient(
    undefined as unknown as ConstructorParameters<typeof PrismaClient>[0]
  ) as PrismaClientType);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
