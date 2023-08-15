import { User, Post } from '@prisma/client'

import UserRepository, { getDefaultUserRepository } from '../repositories/userRepository'
import CreateUserInput from '../types/CreateUserInput'
import UpdateUserInput from '../types/UpdateUserInput'

import { ValidationCode, ValidationError } from '../util/validations/ValidationError'
import { isValidEmail } from '../util/validations'
import { ERROR_CODES } from '../prisma'

/**
 * A service for handling user-related operations.
 *
 * @class
 */
class UserService {
  userRepository: UserRepository

  /**
   * Constructs a new UserService instance.
   *
   * @constructor
   * @param {UserRepository} userRepository - The user repository to use.
   */
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  /**
   * Creates a new user.
   *
   * @param {CreateUserInput} userData - The user data for creation.
   * @returns {Promise<User | ValidationError>} The created user or a validation error.
   */
  async createUser(userData: CreateUserInput): Promise<User | ValidationError> {
    const error = validateCreateUserInput(userData)

    if (error != null) return error

    let user: User

    try {
      user = await this.userRepository.createUser(userData)
    } catch (e) {
      if (e.code == ERROR_CODES.UniqueConstraint) {
        return new ValidationError(
          ValidationCode.INVALID_FIELD,
          `Unique field required: ${e.meta.target}`
        )
      }
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      dateOfBirth: user.dateOfBirth,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    }
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param {number} id - The ID of the user to retrieve.
   * @returns {Promise<User | null>} The retrieved user or null if not found.
   */
  async getUserById(id: number): Promise<User | null> {
    let user: User | null = await this.userRepository.getUserById(id)

    if (user != null) {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      }
    }

    return null
  }

  /**
   * Updates a user by their ID.
   *
   * @param {number} id - The ID of the user to update.
   * @param {UpdateUserInput} userData - The updated user data.
   * @returns {Promise<User | ValidationError | null>} The updated user, a validation error, or null if not found.
   */
  async updateUserById(
    id: number,
    userData: UpdateUserInput
  ): Promise<User | ValidationError | null> {
    const error = validateUpdateUserInput(userData)

    if (error != null) return error

    let user = await this.userRepository.updateUserById(id, userData)

    return user
  }

  /**
   * Deletes a user by their ID.
   *
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<User | ValidationError>} The deleted user.
   */
  async deleteUserById(id: number): Promise<User | ValidationError> {
    try {
      return await this.userRepository.deleteUserById(id)
    } catch (e) {
      if (e.code == ERROR_CODES.NoRecordFound) {
        return new ValidationError(ValidationCode.NO_RECORD, 'No user by id found')
      }
    }
  }

  /**
   * Retrieves posts associated with a user.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Post[]>} The posts associated with the user.
   */
  async getUserPosts(userId: number): Promise<Post[]> {
    return await this.userRepository.getUserPosts(userId)
  }
}

/**
 * Validates the input data for creating a user.
 *
 * @param {CreateUserInput} userData - The user data for creation.
 * @returns {ValidationError | null} A validation error or null if data is valid.
 */
export const validateCreateUserInput = (userData: CreateUserInput): ValidationError | null => {
  if (userData.username == null || userData.username == undefined) {
    return new ValidationError(ValidationCode.MISSING_FIELD, 'Username required')
  }

  if (userData.email == null || userData.email == undefined) {
    return new ValidationError(ValidationCode.MISSING_FIELD, 'Email required')
  }

  if (!isValidEmail(userData.email)) {
    return new ValidationError(ValidationCode.INVALID_FIELD, 'Email format incorrect')
  }

  return null
}

/**
 * Validates the input data for updating a user.
 *
 * @param {UpdateUserInput} userData - The updated user data.
 * @returns {ValidationError | null} A validation error or null if data is valid.
 */
export const validateUpdateUserInput = (userData: UpdateUserInput): ValidationError | null => {
  if (userData.email && !isValidEmail(userData.email)) {
    return new ValidationError(ValidationCode.INVALID_FIELD, 'Email format incorrect')
  }

  return null
}

/**
 * Returns a default instance of UserService with a default user repository.
 *
 * @returns {UserService} A default UserService instance.
 */
export const getDefaultUserService = (): UserService => {
  let userRepo = getDefaultUserRepository()

  return new UserService(userRepo)
}

export default UserService
