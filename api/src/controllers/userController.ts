import { Request, Response } from 'express'

import UserService, { getDefaultUserService } from '../services/userService'
import CreateUserInput from '../types/CreateUserInput'

export const createUser = (userService: UserService = getDefaultUserService()) => {
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
