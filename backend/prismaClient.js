const { PrismaClient } = require('@prisma/client')

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL (or POSTGRES_*) environment variable for Prisma')
}

// Prisma only reads DATABASE_URL, so mirror the detected value there
process.env.DATABASE_URL = databaseUrl

const globalForPrisma = globalThis

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.PRISMA_LOG_QUERIES === 'true' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

module.exports = { prisma }


