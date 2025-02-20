import { PrismaClient } from "@prisma/client";

export { ExpressAuth, getSession } from "@auth/express"
export { PrismaAdapter } from "@auth/prisma-adapter"

// export { ExpressAuth, PrismaAdapter }

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;