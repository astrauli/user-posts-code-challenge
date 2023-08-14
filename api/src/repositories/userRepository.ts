import { Prisma, User } from '@prisma/client'
import CreateUserInput from '../types/CreateUserInput'
import { prisma } from '../prisma'

class UserRepository {
  userClient: Prisma.UserDelegate

  constructor(userClient: Prisma.UserDelegate) {
    this.userClient = userClient
  }

  async createUser(user: CreateUserInput): Promise<User> {
    return await this.userClient.create({ data: user })
  }
}

export const getDefaultUserRepository = (): UserRepository => {
  return new UserRepository(prisma.user)
}

export default UserRepository
