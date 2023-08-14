import { Post } from '@prisma/client'

import PostRepository, { getDefaultPostRepository } from '../repositories/postRepository'
import UpdatePostInput from '../types/UpdatePostInput'

class PostService {
  postRepository: PostRepository

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository
  }

  async getPostById(id: number): Promise<Post | null> {
    let post: Post | null = await this.postRepository.getPostById(id)

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

  async updatePostById(id: number, postData: UpdatePostInput): Promise<Post | null> {
    let post = await this.postRepository.updatePostById(id, postData)

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

export const getDefaultPostService = () => {
  let postRepo = getDefaultPostRepository()

  return new PostService(postRepo)
}

export default PostService
