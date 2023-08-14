import { Request, Response } from 'express'

import UserService, { getDefaultUserService } from '../services/userService'
import CreateUserInput from '../types/CreateUserInput'
import { ERROR_CODES } from '../prisma'
import { ValidationError } from '../util/validations/ValidationError'
import { User, Post } from '@prisma/client'

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

      const response: User | ValidationError = await userService.createUser(userPayload)

      if (response instanceof ValidationError) {
        res.status(400).json({ message: response.message })
        return
      }

      res.status(201).json({ data: response })
    } catch {
      res.status(500).send()
    }
  }
}

export const getUserById = (userService: UserService = getDefaultUserService()) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id

      const user: User | null = await userService.getUserById(parseInt(userId))

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

      const response: User | ValidationError | null = await userService.updateUserById(
        parseInt(userId),
        newData
      )

      if (response instanceof ValidationError) {
        res.status(400).json({ message: response.message })
        return
      }

      if (response == null) {
        res.status(404).json({ data: null })
      } else {
        res.status(200).json({ data: response })
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
      const user: User = await userService.deleteUserById(parseInt(userId))

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

export const getUserPosts = (userService: UserService = getDefaultUserService()) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id
      const posts: Post[] = await userService.getUserPosts(parseInt(userId))

      res.status(200).json({ data: { posts } })
    } catch {
      res.status(500).send()
    }
  }
}
