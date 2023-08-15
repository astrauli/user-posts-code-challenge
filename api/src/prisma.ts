import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

/**
 * Prisma error codes
 * https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
 */
export const ERROR_CODES = {
  // Thrown when a prisma call expects a record and none is found.
  NoRecordFound: 'P2025',
  // Thrown when a unique constraint is violated.
  UniqueConstraint: 'P2002',
}
