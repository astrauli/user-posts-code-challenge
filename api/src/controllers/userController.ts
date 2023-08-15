import { Request, Response, RequestHandler } from 'express'

import UserService, { getDefaultUserService } from '../services/userService'
import CreateUserInput from '../types/CreateUserInput'
import { ERROR_CODES } from '../prisma'
import { ValidationError } from '../util/validations/ValidationError'
import { User, Post } from '@prisma/client'

interface CreateUserRequestBody {
  username: string
  fullName: string
  email: string
  dateOfBirth: string
}

interface UpdateUserRequestBody {
  username?: string
  fullName?: string
  email?: string
  dateOfBirth?: string
}

/**
 * Creates a user.
 *
 * @param {UserService} userService - The user service to perform the creation.
 * @returns {RequestHandler} Express.js route handler function.
 */
export const createUser = (userService: UserService = getDefaultUserService()): RequestHandler => {
  /**
   * Express.js route handler for creating a user.
   *
   * @param {Request} req - Express.js request object.
   * @param {Response} res - Express.js response object.
   * @returns {Promise<void>} A Promise that resolves once the operation is completed.
   *
   * @property {string} req.body.username - The username of the new user.
   * @property {string} req.body.fullName - The full name of the new user.
   * @property {string} req.body.email - The email of the new user.
   * @property {string} req.body.dateOfBirth - The date of birth of the new user in 'YYYY-MM-DD' format.
   */
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreateUserRequestBody = req.body

      const userPayload: CreateUserInput = {
        ...data,
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

/**
 * Gets a user by their ID.
 *
 * @param {UserService} userService - The user service to perform the fetch.
 * @returns {RequestHandler} Express.js route handler function.
 */
export const getUserById = (userService: UserService = getDefaultUserService()): RequestHandler => {
  /**
   * Express.js route handler for fetching a user by their ID.
   *
   * @param {Request} req - Express.js request object.
   * @param {Response} res - Express.js response object.
   * @returns {Promise<void>} A Promise that resolves once the operation is completed.
   *
   * @property {string} req.params.id - The ID of the user to fetch.
   */
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

/**
 * Updates a user by their ID.
 *
 * @param {UserService} userService - The user service to perform the update.
 * @returns {RequestHandler} Express.js route handler function.
 */
export const updateUserById = (
  userService: UserService = getDefaultUserService()
): RequestHandler => {
  /**
   * Express.js route handler for updating a user by their ID.
   *
   * @param {Request} req - Express.js request object.
   * @param {Response} res - Express.js response object.
   * @returns {Promise<void>} A Promise that resolves once the operation is completed.
   *
   * Param properties
   * @property {string} req.params.id - The ID of the user to update.
   *
   * Body properties
   * @property {string} [req.body.username] - The username to update the user with (optional).
   * @property {string} [req.body.fullName] - The full name to update the user with (optional).
   * @property {string} [req.body.email] - The email to update the user with (optional).
   * @property {string} [req.body.dateOfBirth] - The date of birth to update the user with ('YYYY-MM-DD') (optional).
   */
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id
      const newData: UpdateUserRequestBody = req.body

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

/**
 * Deletes a user by their ID.
 *
 * @param {UserService} userService - The user service to perform the deletion.
 * @returns {RequestHandler} Express.js route handler function.
 */
export const deleteUserById = (
  userService: UserService = getDefaultUserService()
): RequestHandler => {
  /**
   * Express.js route handler for deleting a user by ID.
   *
   * @param {Request} req - Express.js request object.
   * @param {Response} res - Express.js response object.
   * @returns {Promise<void>} A Promise that resolves once the operation is completed.
   *
   * @property {string} req.params.id - The ID of the user to delete.
   */
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

/**
 * Gets a user's posts by a user ID.
 *
 * @param {UserService} userService - The user service to perform the fetch.
 * @returns {RequestHandler} Express.js route handler function.
 */
export const getUserPosts = (
  userService: UserService = getDefaultUserService()
): RequestHandler => {
  /**
   * Express.js route handler for fetching a user's posts by their user ID.
   *
   * @param {Request} req - Express.js request object.
   * @param {Response} res - Express.js response object.
   * @returns {Promise<void>} A Promise that resolves once the operation is completed.
   *
   * @property {string} req.params.id - The ID of the user to fetch posts from.
   */
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
