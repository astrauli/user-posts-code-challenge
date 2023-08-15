import { Post } from '@prisma/client'

import PostRepository, { getDefaultPostRepository } from '../repositories/postRepository'
import UpdatePostInput from '../types/UpdatePostInput'
import CreatePostInput from '../types/CreatePostInput'
import { ValidationError, ValidationCode } from '../util/validations/ValidationError'
import { ERROR_CODES } from '../prisma'

/**
 * A service for handling post-related operations.
 *
 * @class
 */
class PostService {
  postRepository: PostRepository

  /**
   * Constructs a new PostService instance.
   *
   * @constructor
   * @param {PostRepository} postRepository - The post repository to use.
   */
  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository
  }

  /**
   * Creates a new post for a specified user.
   *
   * @param {number} userId - The ID of the user creating the post.
   * @param {CreatePostInput} postData - The post data for creation.
   * @returns {Promise<Post | ValidationError>} The created post or a validation error.
   */
  async createPostByUserId(
    userId: number,
    postData: CreatePostInput
  ): Promise<Post | ValidationError> {
    const error = validateCreatePostInput(postData)

    if (error != null) return error

    const post: Post = await this.postRepository.createPostByUserId(userId, postData)

    return {
      id: post.id,
      title: post.title,
      description: post.description,
      userId: post.userId,
      updatedAt: post.updatedAt,
      createdAt: post.createdAt,
    }
  }

  /**
   * Retrieves a post by its ID.
   *
   * @param {number} id - The ID of the post to retrieve.
   * @returns {Promise<Post | null>} The retrieved post or null if not found.
   */
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

  /**
   * Updates a post by its ID.
   *
   * @param {number} id - The ID of the post to update.
   * @param {UpdatePostInput} postData - The updated post data.
   * @returns {Promise<Post | ValidationError | null>} The updated post, a validation error, or null if not found.
   */
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

  /**
   * Deletes a post by its ID.
   *
   * @param {number} id - The ID of the post to delete.
   * @returns {Promise<Post | ValidationError>} The deleted post.
   */
  async deletePostById(id: number): Promise<Post | ValidationError> {
    try {
      return await this.postRepository.deletePostById(id)
    } catch (e) {
      if (e.code == ERROR_CODES.NoRecordFound) {
        return new ValidationError(ValidationCode.NO_RECORD, 'No post by id found')
      }
    }
  }
}

/**
 * Maximum length for the title input.
 */
export const MAX_TITLE_INPUT = 255

/**
 * Maximum length for the description input.
 */
export const MAX_DESCRIPTION_INPUT = 500

/**
 * Validates the input data for creating a post.
 *
 * @param {CreatePostInput} postData - The post data for creation.
 * @returns {ValidationError | null} A validation error or null if data is valid.
 */
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

/**
 * Validates the input data for updating a post.
 *
 * @param {UpdatePostInput} postData - The updated post data.
 * @returns {ValidationError | null} A validation error or null if data is valid.
 */
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

/**
 * Returns a default instance of PostService with a default post repository.
 *
 * @returns {PostService} A default PostService instance.
 */
export const getDefaultPostService = (): PostService => {
  let postRepo = getDefaultPostRepository()

  return new PostService(postRepo)
}

export default PostService
