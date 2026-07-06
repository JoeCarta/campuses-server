import { PrismaClient } from '@prisma/client'

// one shared prisma client for the whole app
export const prisma = new PrismaClient()
