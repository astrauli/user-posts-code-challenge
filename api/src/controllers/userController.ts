import { Request, Response } from 'express'

import UserService, { getDefaultUserService } from '../services/userService'
import CreateUserInput from '../types/CreateUserInput'
import { ERROR_CODES } from '../prisma'

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

export const getUserById = (userService: UserService = getDefaultUserService()) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id

      const user = await userService.getUserById(parseInt(userId))

      if (user == null) {
        res.status(404).json({ data: null })
      } else {
        res.status(200).json({ data: user })
      }
    } catch {
      res.status(500).send()
    }
  }
}

export const updateUserById = (userService: UserService = getDefaultUserService()) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id
      const newData = req.body

      const user = await userService.updateUserById(parseInt(userId), newData)

      if (user == null) {
        res.status(404).json({ data: null })
      } else {
        res.status(200).json({ data: user })
      }
    } catch {
      res.status(500).send()
    }
  }
}

export const deleteUserById = (userService: UserService = getDefaultUserService()) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id

      const user = await userService.deleteUserById(parseInt(userId))

      res.status(200).json({ data: { user } })
    } catch (e) {
      if (e.code == ERROR_CODES.NoRecordFound) {
        res.status(404).send()
      } else {
        res.status(500).send()
      }
    }
  }
}
