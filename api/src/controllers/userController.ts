import { Request, Response } from 'express'

import { prisma } from '../prisma'
import UserService from '../services/userService'
import UserRepository from '../repositories/userRepository'
import CreateUserInput from '../types/CreateUserInput'

const getService = () => {
  let userRepo = new UserRepository(prisma.user)
  let userService = new UserService(userRepo)

  return userService
}

export const createUser = (userService: UserService = getService()) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body

      const userPayload: CreateUserInput = {
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      }

      const user = await userService.createUser(userPayload)

      res.status(201).json({ data: user })
    } catch {
      res.status(500).send()
    }
  }
}
