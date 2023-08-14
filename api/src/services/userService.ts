import { User } from '@prisma/client'

import UserRepository from '../repositories/userRepository'
import CreateUserInput from '../types/CreateUserInput'

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
}

export default UserService
