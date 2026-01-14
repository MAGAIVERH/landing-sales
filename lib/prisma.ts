import * as PrismaClientPkg from '@prisma/client';

const PrismaClientCtor = (
  PrismaClientPkg as unknown as { PrismaClient: new () => any }
).PrismaClient;

type PrismaClientType = InstanceType<typeof PrismaClientCtor>;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientType };

export const prisma = globalForPrisma.prisma ?? new PrismaClientCtor();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
