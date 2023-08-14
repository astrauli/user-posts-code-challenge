import { describe } from 'mocha'
import chai, { expect } from 'chai'
import sinon, { SinonSpy, fake, stub } from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import { Request } from 'express'
import { getPostById, updatePostById, deletePostById } from '../../src/controllers/postController'
import PostService from '../../src/services/postService'
import { getDefaultPostRepository } from '../../src/repositories/postRepository'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Post } from '@prisma/client'

chai.use(chaiAsPromised)

describe('PostController', () => {
  let postService: PostService

  let getPostByIdWithStub: Function
  let updatePostByIdWithStub: Function
  let deletePostByIdWithStub: Function

  let fakePostServiceGetPostById: SinonSpy
  let fakePostServiceUpdatePostById: SinonSpy
  let fakePostServiceDeletePostById: SinonSpy

  before(() => {
    postService = new PostService(getDefaultPostRepository())
  })

  describe('#getPostById', () => {
    describe('post found', () => {
      before(() => {
        fakePostServiceGetPostById = sinon.replace(
          postService,
          'getPostById',
          fake.resolves(defaultPost())
        )

        getPostByIdWithStub = getPostById(postService)
      })

      after(() => {
        sinon.restore()
      })

      it('should get post by id', async () => {
        const postId = 1

        const mockRequest = {
          params: { id: postId },
        } as unknown as Request

        const mockResponse: any = mockedResponse()

        await getPostByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(fakePostServiceGetPostById, postId)
      })

      it('should return a 200 code', async () => {
        const postId = 1

        const mockRequest = {
          params: { id: postId },
        } as unknown as Request

        const mockResponse: any = mockedResponse()

        await getPostByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 200)
      })
    })

    describe('post not found', () => {
      before(() => {
        let postServiceResult = null

        fakePostServiceGetPostById = sinon.replace(
          postService,
          'getPostById',
          fake.resolves(postServiceResult)
        )

        getPostByIdWithStub = getPostById(postService)
      })

      after(() => {
        sinon.restore()
      })

      it('should return null', async () => {
        const postId = 1

        const mockRequest = {
          params: { id: postId },
        } as unknown as Request

        const mockResponse: any = mockedResponse()

        await getPostByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.json, { data: null })
      })

      it('should return a 404 code', async () => {
        const postId = 1

        const mockRequest = {
          params: { id: postId },
        } as unknown as Request

        const mockResponse: any = mockedResponse()

        await getPostByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 404)
      })
    })
  })

  describe('#updatePostById', () => {
    describe('post found', () => {
      before(() => {
        fakePostServiceUpdatePostById = sinon.replace(
          postService,
          'updatePostById',
          fake.resolves(defaultPost())
        )

        updatePostByIdWithStub = updatePostById(postService)
      })

      after(() => {
        sinon.restore()
      })

      it('should update post by id', async () => {
        const postId = 1
        const title = 'test_title'

        const mockRequest = {
          params: { id: postId },
          body: { title },
        } as unknown as Request

        const mockResponse: any = mockedResponse()

        await updatePostByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(fakePostServiceUpdatePostById, postId, { title })
      })

      it('should return a 200 code', async () => {
        const postId = 1
        const title = 'test_title'

        const mockRequest = {
          params: { id: postId },
          body: { title },
        } as unknown as Request

        const mockResponse: any = mockedResponse()

        await updatePostByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 200)
      })
    })

    describe('post not found', () => {
      before(() => {
        let postServiceResult = null

        fakePostServiceGetPostById = sinon.replace(
          postService,
          'updatePostById',
          fake.resolves(postServiceResult)
        )

        updatePostByIdWithStub = updatePostById(postService)
      })

      after(() => {
        sinon.restore()
      })

      it('should return null', async () => {
        const postId = 1
        const title = 'test title'

        const mockRequest = {
          params: { id: postId },
          body: { title },
        } as unknown as Request

        const mockResponse: any = mockedResponse()

        await updatePostByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.json, { data: null })
      })

      it('should return a 404 code', async () => {
        const postId = 1
        const title = 'test title'

        const mockRequest = {
          params: { id: postId },
          body: { title },
        } as unknown as Request

        const mockResponse: any = mockedResponse()

        await updatePostByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 404)
      })
    })
  })

  describe('#deletePostById', () => {
    describe('post found', () => {
      before(() => {
        fakePostServiceDeletePostById = sinon.replace(
          postService,
          'deletePostById',
          fake.resolves(defaultPost())
        )

        deletePostByIdWithStub = deletePostById(postService)
      })

      after(() => {
        sinon.restore()
      })

      it('should delete post by id', async () => {
        const postId = 1

        const mockRequest = {
          params: { id: postId },
        } as unknown as Request

        const mockResponse: any = mockedResponse()

        await deletePostByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(fakePostServiceDeletePostById, postId)
      })

      it('should return a 200 code', async () => {
        const postId = 1

        const mockRequest = {
          params: { id: postId },
        } as unknown as Request

        const mockResponse: any = mockedResponse()

        await deletePostByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 200)
      })
    })

    describe('post not found', () => {
      before(() => {
        fakePostServiceGetPostById = sinon.replace(
          postService,
          'deletePostById',
          fake.throws(
            new PrismaClientKnownRequestError('No record found', {
              code: 'P2025',
              clientVersion: 'SomeClientVersion',
            })
          )
        )

        deletePostByIdWithStub = deletePostById(postService)
      })

      after(() => {
        sinon.restore()
      })

      it('should return a 404 code', async () => {
        const postId = 1

        const mockRequest = {
          params: { id: postId },
        } as unknown as Request

        const mockResponse: any = mockedResponse()

        await deletePostByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 404)
      })
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

const mockedResponse = () => {
  return {
    send: stub().returnsThis(),
    status: stub().returnsThis(),
    json: stub().returnsThis(),
  }
}
