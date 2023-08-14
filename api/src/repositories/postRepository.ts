import { Prisma, Post } from '@prisma/client'
import CreatePostInput from '../types/CreatePostInput'
import UpdatePostInput from '../types/UpdatePostInput'
import { prisma } from '../prisma'

class PostRepository {
  postClient: Prisma.PostDelegate

  constructor(postClient: Prisma.PostDelegate) {
    this.postClient = postClient
  }

  async createPostByUserId(userId: number, post: CreatePostInput): Promise<Post> {
    return await this.postClient.create({
      data: {
        userId,
        ...post,
      },
    })
  }

  async getPostById(id: number): Promise<Post> {
    return await this.postClient.findUnique({ where: { id } })
  }

  async updatePostById(id: number, data: UpdatePostInput): Promise<Post> {
    return await this.postClient.update({ where: { id }, data })
  }

  async deletePostById(id: number): Promise<Post> {
    return await this.postClient.delete({ where: { id } })
  }
}

export const getDefaultPostRepository = (): PostRepository => {
  return new PostRepository(prisma.post)
}

export default PostRepository
