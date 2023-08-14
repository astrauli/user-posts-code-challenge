import { Prisma, User, Post } from '@prisma/client'
import CreateUserInput from '../types/CreateUserInput'
import UpdateUserInput from '../types/UpdateUserInput'
import { prisma } from '../prisma'

class UserRepository {
  userClient: Prisma.UserDelegate

  constructor(userClient: Prisma.UserDelegate) {
    this.userClient = userClient
  }

  async createUser(user: CreateUserInput): Promise<User> {
    return await this.userClient.create({ data: user })
  }

  async getUserById(id: number): Promise<User> {
    return await this.userClient.findUnique({ where: { id } })
  }

  async updateUserById(id: number, data: UpdateUserInput): Promise<User> {
    return await this.userClient.update({ where: { id }, data })
  }

  async deleteUserById(id: number): Promise<User> {
    return await this.userClient.delete({ where: { id } })
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    const user = await this.userClient.findUnique({
      where: {
        id: userId,
      },
      include: {
        posts: {
          orderBy: {
            updatedAt: 'asc',
          },
        },
      },
    })

    return user.posts
  }
}

export const getDefaultUserRepository = (): UserRepository => {
  return new UserRepository(prisma.user)
}

export default UserRepository
