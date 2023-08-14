import { Post } from '@prisma/client'

import PostRepository, { getDefaultPostRepository } from '../repositories/postRepository'
import UpdatePostInput from '../types/UpdatePostInput'
import CreatePostInput from '../types/CreatePostInput'
import { ValidationError, ValidationCode } from '../util/validations/ValidationError'

class PostService {
  postRepository: PostRepository

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository
  }

  async createPostByUserId(id: number, postData: CreatePostInput): Promise<Post | ValidationError> {
    const error = validateCreatePostInput(postData)

    if (error != null) return error

    const post: Post = await this.postRepository.createPostByUserId(id, postData)

    return {
      id: post.id,
      title: post.title,
      description: post.description,
      userId: post.userId,
      updatedAt: post.updatedAt,
      createdAt: post.createdAt,
    }
  }

  async getPostById(id: number): Promise<Post | null> {
    const post: Post | null = await this.postRepository.getPostById(id)

    if (post != null) {
      return {
        id: post.id,
        title: post.title,
        description: post.description,
        userId: post.userId,
        updatedAt: post.updatedAt,
        createdAt: post.createdAt,
      }
    }

    return null
  }

  async updatePostById(
    id: number,
    postData: UpdatePostInput
  ): Promise<Post | ValidationError | null> {
    const error = validateUpdatePostInput(postData)

    if (error != null) return error

    const post = await this.postRepository.updatePostById(id, postData)

    return {
      id: post.id,
      title: post.title,
      description: post.description,
      userId: post.userId,
      updatedAt: post.updatedAt,
      createdAt: post.createdAt,
    }
  }

  async deletePostById(id: number): Promise<Post> {
    return await this.postRepository.deletePostById(id)
  }
}

export const MAX_TITLE_INPUT = 255
export const MAX_DESCRIPTION_INPUT = 500

export const validateCreatePostInput = (postData: CreatePostInput): ValidationError | null => {
  if (postData.title == null || postData.title == undefined) {
    return new ValidationError(ValidationCode.MISSING_FIELD, 'Title required')
  }

  if (postData.description == null || postData.description == undefined) {
    return new ValidationError(ValidationCode.MISSING_FIELD, 'Description required')
  }

  if (postData.title.length > MAX_TITLE_INPUT) {
    return new ValidationError(
      ValidationCode.INVALID_FIELD,
      'Title length limited to 255 characters'
    )
  }

  if (postData.description.length > MAX_DESCRIPTION_INPUT) {
    return new ValidationError(
      ValidationCode.INVALID_FIELD,
      'Description length limited to 500 characters'
    )
  }

  return null
}

export const validateUpdatePostInput = (postData: UpdatePostInput): ValidationError | null => {
  if (postData.title && postData.title.length > MAX_TITLE_INPUT) {
    return new ValidationError(
      ValidationCode.INVALID_FIELD,
      'Title length limited to 255 characters'
    )
  }

  if (postData.description && postData.description.length > MAX_DESCRIPTION_INPUT) {
    return new ValidationError(
      ValidationCode.INVALID_FIELD,
      'Description length limited to 500 characters'
    )
  }

  return null
}

export const getDefaultPostService = () => {
  let postRepo = getDefaultPostRepository()

  return new PostService(postRepo)
}

export default PostService
