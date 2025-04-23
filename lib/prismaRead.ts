// lib/prismaRead.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // чтобы во время разработки не создавать по несколько клиентов
  var prismaRead: PrismaClient | undefined;
}

// Используем DATABASE_URL_READ
const prismaRead =
  global.prismaRead ||
  new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL_READ } },
  });

if (process.env.NODE_ENV === 'development') {
  global.prismaRead = prismaRead;
}

export default prismaRead;
