import { User, Post } from '@prisma/client'

import UserRepository, { getDefaultUserRepository } from '../repositories/userRepository'
import CreateUserInput from '../types/CreateUserInput'
import UpdateUserInput from '../types/UpdateUserInput'

import { ValidationCode, ValidationError } from '../util/validations/ValidationError'
import { isValidEmail } from '../util/validations'

class UserService {
  userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async createUser(userData: CreateUserInput): Promise<User | ValidationError> {
    const error = validateCreateUserInput(userData)

    if (error != null) return error

    let user: User = await this.userRepository.createUser(userData)

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

  async updateUserById(
    id: number,
    userData: UpdateUserInput
  ): Promise<User | ValidationError | null> {
    const error = validateUpdateUserInput(userData)

    if (error != null) return error

    let user = await this.userRepository.updateUserById(id, userData)

    return user
  }

  async deleteUserById(id: number): Promise<User> {
    return await this.userRepository.deleteUserById(id)
  }

  async getUserPosts(id: number): Promise<Post[]> {
    return await this.userRepository.getUserPosts(id)
  }
}

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

export const validateUpdateUserInput = (userData: UpdateUserInput): ValidationError | null => {
  if (userData.email && !isValidEmail(userData.email)) {
    return new ValidationError(ValidationCode.INVALID_FIELD, 'Email format incorrect')
  }

  return null
}

export const getDefaultUserService = () => {
  let userRepo = getDefaultUserRepository()

  return new UserService(userRepo)
}

export default UserService
