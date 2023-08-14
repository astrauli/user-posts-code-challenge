import { describe } from 'mocha'
import chai, { expect } from 'chai'
import sinon, { fake } from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import { prisma } from '../../src/prisma'
import PostRepository from '../../src/repositories/postRepository'
import PostService, { MAX_DESCRIPTION_INPUT, MAX_TITLE_INPUT } from '../../src/services/postService'
import { Post } from '@prisma/client'
import { ValidationError } from '../../src/util/validations/ValidationError'
import CreatePostInput from '../../src/types/CreatePostInput'

chai.use(chaiAsPromised)

describe('PostService', () => {
  var postService: PostService
  var postRepository: PostRepository

  before(() => {
    postRepository = new PostRepository(prisma.post)
    postService = new PostService(postRepository)
  })

  describe('#createPostByUserId', () => {
    afterEach(() => {
      sinon.restore()
    })

    describe('input validation', () => {
      it('should return a ValidationError on null title', async () => {
        const badTitle = null

        const postInput = defaultPostInput({ ...{ title: badTitle } })

        const response = await postService.createPostByUserId(1, postInput)

        expect(response).to.be.instanceOf(ValidationError)
      })

      it('should return a ValidationError on undefined title', async () => {
        const badTitle = undefined

        const postInput = defaultPostInput({ ...{ title: badTitle } })

        const response = await postService.createPostByUserId(1, postInput)

        expect(response).to.be.instanceOf(ValidationError)
      })

      it('should return a ValidationError on null description', async () => {
        const badDescription = null

        const postInput = defaultPostInput({ ...{ description: badDescription } })

        const response = await postService.createPostByUserId(1, postInput)

        expect(response).to.be.instanceOf(ValidationError)
      })

      it('should return a ValidationError on undefined description', async () => {
        const badDescription = undefined

        const postInput = defaultPostInput({ ...{ description: badDescription } })

        const response = await postService.createPostByUserId(1, postInput)

        expect(response).to.be.instanceOf(ValidationError)
      })

      it('should return a ValidationError on invalid title length', async () => {
        const badTitle = generateString(MAX_TITLE_INPUT + 1)

        const postInput = defaultPostInput({ ...{ title: badTitle } })

        const response = await postService.createPostByUserId(1, postInput)

        expect(response).to.be.instanceOf(ValidationError)
      })

      it('should return a ValidationError on invalid description length', async () => {
        const badDescription = generateString(MAX_DESCRIPTION_INPUT + 1)

        const postInput = defaultPostInput({ ...{ description: badDescription } })

        const response = await postService.createPostByUserId(1, postInput)

        expect(response).to.be.instanceOf(ValidationError)
      })
    })

    it('should return a post', async () => {
      const userId = 1

      const postInput = defaultPostInput()

      const postCreated = {
        id: 1,
        userId,
        ...postInput,
        updatedAt: new Date(),
        createdAt: new Date(),
      }

      sinon.replace(postRepository, 'createPostByUserId', fake.resolves(postCreated))

      let post = await postService.createPostByUserId(userId, postInput)

      expect(post).to.deep.equal(postCreated)
    })
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

    describe('input validation', () => {
      it('should return a ValidationError on invalid title length', async () => {
        const badTitle = generateString(MAX_TITLE_INPUT + 1)

        const postInput = defaultPostInput({ ...{ title: badTitle } })

        const response = await postService.createPostByUserId(1, postInput)

        expect(response).to.be.instanceOf(ValidationError)
      })

      it('should return a ValidationError on invalid description length', async () => {
        const badDescription = generateString(MAX_DESCRIPTION_INPUT + 1)

        const postInput = defaultPostInput({ ...{ description: badDescription } })

        const response = await postService.createPostByUserId(1, postInput)

        expect(response).to.be.instanceOf(ValidationError)
      })
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

const defaultPostInput = (overrides?: Partial<CreatePostInput>): CreatePostInput => {
  const defaultValues: CreatePostInput = {
    title: 'Default title',
    description: 'default description',
  }

  return { ...defaultValues, ...overrides }
}

const generateString = (length: number, character: string = '*'): string => {
  if (length <= 0) {
    return ''
  }

  let result = ''
  while (result.length < length) {
    result += character
  }

  return result.substring(0, length)
}
