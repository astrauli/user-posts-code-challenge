import { Prisma, Post } from '@prisma/client'
import CreatePostInput from '../types/CreatePostInput'
import UpdatePostInput from '../types/UpdatePostInput'
import { prisma } from '../prisma'

/**
 * A repository for handling post-related database operations.
 *
 * @class
 */
class PostRepository {
  postClient: Prisma.PostDelegate

  /**
   * Constructs a new PostRepository instance.
   *
   * @constructor
   * @param {Prisma.PostDelegate} postClient - The Prisma client for the Post model.
   */
  constructor(postClient: Prisma.PostDelegate) {
    this.postClient = postClient
  }

  /**
   * Creates a new post for a specified user.
   *
   * @param {number} userId - The ID of the user creating the post.
   * @param {CreatePostInput} post - The post data for creation.
   * @returns {Promise<Post>} The created post.
   */
  async createPostByUserId(userId: number, post: CreatePostInput): Promise<Post> {
    return await this.postClient.create({
      data: {
        userId,
        ...post,
      },
    })
  }

  /**
   * Retrieves a post by its ID.
   *
   * @param {number} id - The ID of the post to retrieve.
   * @returns {Promise<Post>} The retrieved post.
   */
  async getPostById(id: number): Promise<Post> {
    return await this.postClient.findUnique({ where: { id } })
  }

  /**
   * Updates a post by its ID.
   *
   * @param {number} id - The ID of the post to update.
   * @param {UpdatePostInput} data - The updated post data.
   * @returns {Promise<Post>} The updated post.
   */
  async updatePostById(id: number, data: UpdatePostInput): Promise<Post> {
    return await this.postClient.update({ where: { id }, data })
  }

  /**
   * Deletes a post by its ID.
   *
   * @param {number} id - The ID of the post to delete.
   * @returns {Promise<Post>} The deleted post.
   */
  async deletePostById(id: number): Promise<Post> {
    return await this.postClient.delete({ where: { id } })
  }
}

/**
 * Returns a default instance of PostRepository with a default Prisma post client.
 *
 * @returns {PostRepository} A default PostRepository instance.
 */
export const getDefaultPostRepository = (): PostRepository => {
  return new PostRepository(prisma.post)
}

export default PostRepository
