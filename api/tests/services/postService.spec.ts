import { describe } from 'mocha'
import chai, { expect } from 'chai'
import sinon, { fake } from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import { prisma } from '../../src/prisma'
import PostRepository from '../../src/repositories/postRepository'
import PostService from '../../src/services/postService'
import { Post } from '@prisma/client'

chai.use(chaiAsPromised)

describe('PostService', () => {
  var postService: PostService
  var postRepository: PostRepository

  before(() => {
    postRepository = new PostRepository(prisma.post)
    postService = new PostService(postRepository)
  })

  describe('#getPostById', () => {
    afterEach(() => {
      sinon.restore()
    })

    it('should return a post if found', async () => {
      let id = 1

      const postResult = defaultPost()

      sinon.replace(postRepository, 'getPostById', fake.resolves(postResult))

      let post = await postService.getPostById(id)

      expect(post).to.deep.equal(postResult)
    })

    it('should return null if no post is found', async () => {
      sinon.replace(postRepository, 'getPostById', fake.resolves(null))

      let post = await postService.getPostById(1)

      expect(post).to.equal(null)
    })
  })

  describe('#updatePostById', () => {
    afterEach(() => {
      sinon.restore()
    })

    it('should return a post', async () => {
      let id = 1
      let title = 'test_title'

      let data = {
        title,
      }

      const postResult = defaultPost({ ...data })

      sinon.replace(postRepository, 'updatePostById', fake.resolves(postResult))

      let post = await postService.updatePostById(id, data)

      expect(post).to.deep.equal(postResult)
    })
  })

  describe('#deletePostById', () => {
    afterEach(() => {
      sinon.restore()
    })

    it('should return a post', async () => {
      let id = 1
      let title = 'test_title'

      let data = {
        title,
      }

      const postResult = defaultPost({ ...data })

      sinon.replace(postRepository, 'updatePostById', fake.resolves(postResult))

      let post = await postService.updatePostById(id, data)

      expect(post).to.deep.equal(postResult)
    })
  })
})

const defaultPost = (overrides?: Partial<Post>): Post => {
  const now = new Date()

  const defaultValues: Post = {
    id: 1,
    title: 'Default Title',
    description: 'Default Description',
    userId: 1,
    updatedAt: now,
    createdAt: now,
  }

  return { ...defaultValues, ...overrides }
}
