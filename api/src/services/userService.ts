import { User } from '@prisma/client'

import UserRepository from '../repositories/userRepository'
import CreateUserInput from '../types/CreateUserInput'
import { getDefaultUserRepository } from '../repositories/userRepository'

class UserService {
  userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async createUser(userData: CreateUserInput): Promise<User> {
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
}

export const getDefaultUserService = () => {
  let userRepo = getDefaultUserRepository()

  return new UserService(userRepo)
}

export default UserService
