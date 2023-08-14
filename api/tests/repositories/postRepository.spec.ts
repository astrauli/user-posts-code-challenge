import { describe } from 'mocha'
import chai from 'chai'
import sinon, { replace, fake, SinonSpy } from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import { prisma } from '../../src/prisma'
import PostRepository from '../../src/repositories/postRepository'

chai.use(chaiAsPromised)

describe('PostRepository', () => {
  let postRepository: PostRepository

  let fakeCreatePostByUserId: SinonSpy
  let fakeFindUniqueById: SinonSpy
  let fakeUpdateById: SinonSpy
  let fakeDeleteById: SinonSpy

  before(() => {
    let post = {
      id: 1,
      title: 'any',
      description: 'any',
      updatedAt: new Date(),
      createdAt: new Date(),
    }

    fakeCreatePostByUserId = replace(prisma.post, 'create', fake.resolves(post))
    fakeFindUniqueById = replace(prisma.post, 'findUnique', fake.resolves(post))
    fakeUpdateById = replace(prisma.post, 'update', fake.resolves(post))
    fakeDeleteById = replace(prisma.post, 'delete', fake.resolves(post))

    postRepository = new PostRepository(prisma.post)
  })

  describe('#createPostByUserId', () => {
    it('should create a post', async () => {
      const userId = 1
      const title = 'input title'
      const description = 'input description'

      await postRepository.createPostByUserId(userId, {
        title,
        description,
      })

      sinon.assert.calledOnce(fakeCreatePostByUserId)
      sinon.assert.calledWith(fakeCreatePostByUserId, {
        data: {
          userId,
          title,
          description,
        },
      })
    })
  })

  describe('#getPostById', () => {
    it('should fetch a post', async () => {
      await postRepository.getPostById(1)

      sinon.assert.calledOnce(fakeFindUniqueById)
      sinon.assert.calledWith(fakeFindUniqueById, { where: { id: 1 } })
    })
  })

  describe('#updatePostById', () => {
    it('should return a post', async () => {
      const title = 'input title'
      const description = 'input description'

      const data = {
        title,
        description,
      }

      await postRepository.updatePostById(1, data)

      sinon.assert.calledOnce(fakeUpdateById)
      sinon.assert.calledWith(fakeUpdateById, { where: { id: 1 }, data })
    })
  })

  describe('#deletePostById', () => {
    it('should return a post', async () => {
      await postRepository.deletePostById(1)

      sinon.assert.calledOnce(fakeDeleteById)
      sinon.assert.calledWith(fakeDeleteById, { where: { id: 1 } })
    })
  })
})
