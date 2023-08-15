import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

/**
 * Prisma error codes
 * https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
 */
export const ERROR_CODES = {
  NoRecordFound: 'P2025',
}
