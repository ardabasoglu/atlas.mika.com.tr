import {
  PrismaClient,
  type PrismaClient as PrismaClientType,
} from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

function normalizeConnectionString(raw: string): string {
  const trimmed = raw?.trim() ?? "";
  if (trimmed.length === 0) return "postgresql://localhost:5432/atlas";
  try {
    new URL(trimmed);
    return trimmed;
  } catch {
    // Password may contain # ? * etc.; encode the password segment so URL is valid
    const match = trimmed.match(/^(postgresql:\/\/)([^:]+):([^@]+)@(.+)$/);
    if (!match) return trimmed;
    const [, prefix, user, password, hostPart] = match;
    const encodedPassword = encodeURIComponent(password);
    return `${prefix}${user}:${encodedPassword}@${hostPart}`;
  }
}

const rawUrl = process.env.DATABASE_URL?.trim();
const connectionString = normalizeConnectionString(
  rawUrl && rawUrl.length > 0 ? rawUrl : "postgresql://localhost:5432/atlas"
);

export const prisma: PrismaClientType =
  globalForPrisma.prisma ??
  (new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  }) as PrismaClientType);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
