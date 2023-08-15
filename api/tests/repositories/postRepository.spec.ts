import { describe } from 'mocha'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { prisma } from '../../src/prisma'
import PostRepository from '../../src/repositories/postRepository'
import { Post, User } from '@prisma/client'
import UserRepository from '../../src/repositories/userRepository'

chai.use(chaiAsPromised)

describe('PostRepository', () => {
  let postRepository: PostRepository
  let userRepository: UserRepository

  let user: User
  let post: Post

  let sharedUserUsername = 'test_username1'
  let sharedUserEmail = 'test@test1.com'
  let sharedUserFullName = 'test fullname'
  let sharedUserDateOfBirth = new Date().toISOString()
  let sharedUserId: number

  let sharedPostId: number
  let sharedPostTitle = 'shared post title'
  let sharedPostDescription = 'shared post description'

  beforeEach(async () => {
    user = await prisma.user.create({
      data: {
        username: sharedUserUsername,
        email: sharedUserEmail,
        fullName: sharedUserFullName,
        dateOfBirth: sharedUserDateOfBirth,
      },
    })

    sharedUserId = user.id

    post = await prisma.post.create({
      data: {
        userId: user.id,
        title: sharedPostTitle,
        description: sharedPostDescription,
      },
    })

    sharedPostId = post.id

    postRepository = new PostRepository(prisma.post)
    userRepository = new UserRepository(prisma.user)
  })

  afterEach(async () => {
    const deleteUsers = prisma.user.deleteMany()
    const deletePosts = prisma.post.deleteMany()
    await prisma.$transaction([deleteUsers, deletePosts])
  })

  after(async () => {
    await prisma.$disconnect()
  })

  describe('#createPostByUserId', () => {
    it('should create a user', async () => {
      const date = new Date().toISOString()

      let title = 'test_title'
      let description = 'test_description'

      let post = await postRepository.createPostByUserId(sharedUserId, {
        title,
        description,
      })

      expect(post.title).equal(title)
      expect(post.description).equal(description)
    })
  })

  describe('#getPostById', () => {
    it('should fetch a user', async () => {
      const fetchedPost = await postRepository.getPostById(sharedPostId)

      expect(fetchedPost.title).equal(sharedPostTitle)
      expect(fetchedPost.description).equal(sharedPostDescription)
    })
  })

  describe('#updatePostById', () => {
    it('should return a user', async () => {
      let updatedTitle = 'update title'

      let data = {
        title: updatedTitle,
      }

      let updatedPost = await postRepository.updatePostById(sharedPostId, data)

      expect(updatedPost.title).equal(updatedTitle)
      expect(updatedPost.description).equal(sharedPostDescription)

      sharedPostTitle = updatedTitle
    })
  })

  describe('#deletePostById', () => {
    it('should return a post', async () => {
      const deletedPost = await postRepository.deletePostById(sharedPostId)

      expect(deletedPost.title).equal(sharedPostTitle)
      expect(deletedPost.description).equal(sharedPostDescription)
    })
  })
})
