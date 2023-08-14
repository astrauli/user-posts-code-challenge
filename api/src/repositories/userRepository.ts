import { Prisma, User } from '@prisma/client'
import CreateUserInput from '../types/CreateUserInput'

class UserRepository {
  userClient: Prisma.UserDelegate

  constructor(userClient: Prisma.UserDelegate) {
    this.userClient = userClient
  }

  async createUser(user: CreateUserInput): Promise<User> {
    return await this.userClient.create({ data: user })
  }
}

export default UserRepository
