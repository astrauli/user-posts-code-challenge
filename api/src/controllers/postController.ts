import { Request, Response } from 'express'

import PostService, { getDefaultPostService } from '../services/postService'
import { Post } from '@prisma/client'
import { ERROR_CODES } from '../prisma'

export const getPostById = (postService: PostService = getDefaultPostService()) => {
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

export const updatePostById = (postService: PostService = getDefaultPostService()) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const postId = req.params.id
      const newData = req.body

      const response: Post | null = await postService.updatePostById(parseInt(postId), newData)

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

export const deletePostById = (postService: PostService = getDefaultPostService()) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const postId = req.params.id
      const post: Post = await postService.deletePostById(parseInt(postId))

      res.status(200).json({ data: { post } })
    } catch (e) {
      if (e.code == ERROR_CODES.NoRecordFound) {
        res.status(404).send()
      } else {
        res.status(500).send()
      }
    }
  }
}
