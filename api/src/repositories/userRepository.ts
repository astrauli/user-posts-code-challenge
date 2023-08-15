import { Prisma, User, Post } from '@prisma/client'
import CreateUserInput from '../types/CreateUserInput'
import UpdateUserInput from '../types/UpdateUserInput'
import { prisma, UserWithoutSensitiveFields } from '../prisma'

/**
 * A repository for handling user-related database operations.
 *
 * @class
 */
class UserRepository {
  userClient: Prisma.UserDelegate

  /**
   * Constructs a new UserRepository instance.
   *
   * @constructor
   * @param {Prisma.UserDelegate} userClient - The Prisma client for the User model.
   */
  constructor(userClient: Prisma.UserDelegate) {
    this.userClient = userClient
  }

  /**
   * Creates a new user.
   *
   * @param {CreateUserInput} user - The user data for creation.
   * @returns {Promise<UserWithoutSensitiveFields>} The created user.
   */
  async createUser(user: CreateUserInput): Promise<UserWithoutSensitiveFields> {
    return await this.userClient.create({ data: user })
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param {number} id - The ID of the user to retrieve.
   * @returns {Promise<UserWithoutSensitiveFields>} The retrieved user.
   */
  async getUserById(id: number): Promise<UserWithoutSensitiveFields> {
    return await this.userClient.findUnique({ where: { id } })
  }

  /**
   * Updates a user by their ID.
   *
   * @param {number} id - The ID of the user to update.
   * @param {UpdateUserInput} data - The updated user data.
   * @returns {Promise<UserWithoutSensitiveFields>} The updated user.
   */
  async updateUserById(id: number, data: UpdateUserInput): Promise<UserWithoutSensitiveFields> {
    return await this.userClient.update({ where: { id }, data })
  }

  /**
   * Deletes a user by their ID.
   * Deleting a user will delete all of their posts.
   *
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<UserWithoutSensitiveFields>} The deleted user.
   */
  async deleteUserById(id: number): Promise<UserWithoutSensitiveFields> {
    return await this.userClient.delete({ where: { id } })
  }

  /**
   * Retrieves posts associated with a user.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Post[]>} The posts associated with the user.
   */
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

/**
 * Returns a default instance of UserRepository with a default Prisma user client.
 *
 * @returns {UserRepository} A default UserRepository instance.
 */
export const getDefaultUserRepository = (): UserRepository => {
  return new UserRepository(prisma.user)
}

export default UserRepository
