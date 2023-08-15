import { Request, RequestHandler, Response } from 'express'

import PostService, { getDefaultPostService } from '../services/postService'
import { Post } from '@prisma/client'
import CreatePostInput from '../types/CreatePostInput'
import { ValidationError, ValidationCode } from '../util/validations/ValidationError'

interface CreatePostRequestBody {
  userId: string
  title: string
  description: string
}

interface UpdatePostRequestBody {
  title?: string
  description?: string
}

/**
 * Creates a user post.
 *
 * @param {PostService} postService - The post service to perform the creation.
 * @returns {RequestHandler} Express.js route handler function.
 */
export const createPostByUserId = (
  postService: PostService = getDefaultPostService()
): RequestHandler => {
  /**
   * Express.js route handler for creating a post.
   *
   * @param {Request} req - Express.js request object.
   * @param {Response} res - Express.js response object.
   * @returns {Promise<void>} A Promise that resolves once the operation is completed.
   *
   * @property {string} req.param.userId - The user ID of the user to create the post for.
   * @property {string} req.body.title - The title of the new post.
   * @property {string} req.body.description - The description of the new post.
   */
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreatePostRequestBody = req.body

      const postPayload: CreatePostInput = {
        title: data.title,
        description: data.description,
      }

      const response: Post | ValidationError = await postService.createPostByUserId(
        parseInt(data.userId),
        postPayload
      )

      if (response instanceof ValidationError) {
        res.status(400).json({ code: ValidationCode[response.code], message: response.message })
        return
      }

      res.status(201).json({ data: response })
    } catch {
      res.status(500).send()
    }
  }
}

/**
 * Gets a post by its ID.
 *
 * @param {PostService} postService - The post service to perform the fetch.
 * @returns {RequestHandler} Express.js route handler function.
 */
export const getPostById = (postService: PostService = getDefaultPostService()): RequestHandler => {
  /**
   * Express.js route handler for fetching a post.
   *
   * @param {Request} req - Express.js request object.
   * @param {Response} res - Express.js response object.
   * @returns {Promise<void>} A Promise that resolves once the operation is completed.
   *
   * @property {string} req.param.id - The ID of the post to fetch.
   */
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const postId = req.params.id

      const post: Post | null = await postService.getPostById(parseInt(postId))

      if (post == null) {
        res.status(404).json({ data: null })
      } else {
        res.status(200).json({ data: post })
      }
    } catch {
      res.status(500).send()
    }
  }
}

/**
 * Update a post by its ID.
 *
 * @param {PostService} postService - The post service to perform the update.
 * @returns {RequestHandler} Express.js route handler function.
 */
export const updatePostById = (
  postService: PostService = getDefaultPostService()
): RequestHandler => {
  /**
   * Express.js route handler for updating a post.
   *
   * @param {Request} req - Express.js request object.
   * @param {Response} res - Express.js response object.
   * @returns {Promise<void>} A Promise that resolves once the operation is completed.
   *
   * Param properties
   * @property {string} req.param.id - The ID of the post to update.
   *
   * Body properties
   * @property {string} [req.body.title] - The new title of the post (optional).
   * @property {string} [req.body.description] - The new description of the new post (optional).
   */
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const postId = req.params.id
      const newData: UpdatePostRequestBody = req.body

      const response: Post | ValidationError | null = await postService.updatePostById(
        parseInt(postId),
        newData
      )

      if (response instanceof ValidationError) {
        res.status(400).json({ code: ValidationCode[response.code], message: response.message })
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
 * Delete a post by its ID.
 *
 * @param {PostService} postService - The post service to perform the deletion.
 * @returns {RequestHandler} Express.js route handler function.
 */
export const deletePostById = (
  postService: PostService = getDefaultPostService()
): RequestHandler => {
  /**
   * Express.js route handler for deleting a post.
   *
   * @param {Request} req - Express.js request object.
   * @param {Response} res - Express.js response object.
   * @returns {Promise<void>} A Promise that resolves once the operation is completed.
   *
   * @property {string} req.param.id - The ID of the post to delete.
   */
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const postId = req.params.id
      const response: Post | ValidationError = await postService.deletePostById(parseInt(postId))

      if (response instanceof ValidationError) {
        switch (response.code) {
          case ValidationCode.NO_RECORD:
            res.status(404).json({ code: ValidationCode[response.code], message: response.message })
          default:
            res.status(400).send()
        }
        return
      }

      res.status(200).json({ data: { post: response } })
    } catch {
      res.status(500).send()
    }
  }
}
