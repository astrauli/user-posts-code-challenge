import { describe } from 'mocha'
import chai, { expect } from 'chai'
import sinon, { SinonSpy, fake, stub } from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import { Request } from 'express'
import { Post } from '@prisma/client'
import {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserPosts,
} from '../../src/controllers/userController'
import UserService from '../../src/services/userService'
import { getDefaultUserRepository } from '../../src/repositories/userRepository'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { ValidationCode, ValidationError } from '../../src/util/validations/ValidationError'

chai.use(chaiAsPromised)

describe('UserController', () => {
  let userService: UserService

  let createUserWithStub: Function
  let getUserByIdWithStub: Function
  let updateUserByIdWithStub: Function
  let deleteUserByIdWithStub: Function
  let getUserPostsWithStub: Function

  let fakeUserServiceCreateUser: SinonSpy
  let fakeUserServiceGetUserById: SinonSpy
  let fakeUserServiceUpdateUserById: SinonSpy
  let fakeUserServiceDeleteUserById: SinonSpy
  let fakeUserServiceUserPosts: SinonSpy

  before(() => {
    userService = new UserService(getDefaultUserRepository())
  })

  describe('#createUser', () => {
    describe('success', () => {
      before(() => {
        let id = 1
        let username = 'test_username'
        let email = 'test@test.com'
        let fullName = 'Locker Challenge'
        let dateOfBirth = '2023-08-12'

        let user = {
          id,
          username,
          email,
          fullName,
          dateOfBirth: new Date(dateOfBirth),
          updatedAt: new Date(),
          createdAt: new Date(),
        }

        fakeUserServiceCreateUser = sinon.replace(userService, 'createUser', fake.resolves(user))

        createUserWithStub = createUser(userService)
      })

      after(() => {
        sinon.restore()
      })

      it('should pass the correct user params to the user service', async () => {
        let username = 'test_username'
        let email = 'test@test.com'
        let fullName = 'Locker Challenge'
        let dateOfBirth = '2023-08-12'

        const mockRequest = {
          body: {
            username,
            fullName,
            email,
            dateOfBirth,
          },
        } as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await createUserWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(fakeUserServiceCreateUser, {
          username,
          fullName,
          email,
          dateOfBirth: new Date(dateOfBirth).toISOString(),
        })
      })

      it('should return a 201 status on successful create', async () => {
        let username = 'test_username'
        let email = 'test@test.com'
        let fullName = 'Locker Challenge'
        let dateOfBirth = '2023-08-12'

        const mockRequest = {
          body: {
            username,
            fullName,
            email,
            dateOfBirth,
          },
        } as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await createUserWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 201)
      })
    })

    describe('bad input', () => {
      after(() => {
        sinon.restore()
      })

      it('returns a 400 code', async () => {
        let validationError = new ValidationError(ValidationCode.INVALID_FIELD, 'bad field')

        fakeUserServiceCreateUser = sinon.replace(
          userService,
          'createUser',
          fake.resolves(validationError)
        )

        createUserWithStub = createUser(userService)

        let username = 'test_username'
        let email = 'test@test.com'
        let fullName = 'Locker Challenge'
        let dateOfBirth = '2023-08-12'

        const mockRequest = {
          body: {
            username,
            fullName,
            email,
            dateOfBirth,
          },
        } as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await createUserWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 400)
      })
    })
  })

  describe('#getUserById', () => {
    describe('user found', () => {
      before(() => {
        let id = 1
        let username = 'test_username'
        let email = 'test@test.com'
        let fullName = 'Locker Challenge'
        let dateOfBirth = '2023-08-12'

        let userServiceResult = {
          id,
          username,
          email,
          fullName,
          dateOfBirth: new Date(dateOfBirth),
          updatedAt: new Date(),
          createdAt: new Date(),
        }

        fakeUserServiceGetUserById = sinon.replace(
          userService,
          'getUserById',
          fake.resolves(userServiceResult)
        )

        getUserByIdWithStub = getUserById(userService)
      })

      after(() => {
        sinon.restore()
      })

      it('should get user by id', async () => {
        const userId = 1

        const mockRequest = {
          params: { id: userId },
        } as unknown as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await getUserByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(fakeUserServiceGetUserById, userId)
      })

      it('should return a 200 code', async () => {
        const userId = 1

        const mockRequest = {
          params: { id: userId },
        } as unknown as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await getUserByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 200)
      })
    })

    describe('user not found', () => {
      before(() => {
        let userServiceResult = null

        fakeUserServiceGetUserById = sinon.replace(
          userService,
          'getUserById',
          fake.resolves(userServiceResult)
        )

        getUserByIdWithStub = getUserById(userService)
      })

      after(() => {
        sinon.restore()
      })

      it('should return null', async () => {
        const userId = 1

        const mockRequest = {
          params: { id: userId },
        } as unknown as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await getUserByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.json, { data: null })
      })

      it('should return a 404 code', async () => {
        const userId = 1

        const mockRequest = {
          params: { id: userId },
        } as unknown as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await getUserByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 404)
      })
    })
  })

  describe('#updateUserById', () => {
    describe('user found', () => {
      before(() => {
        let id = 1
        let username = 'test_username'
        let email = 'test@test.com'
        let fullName = 'Locker Challenge'
        let dateOfBirth = '2023-08-12'

        let userServiceResult = {
          id,
          username,
          email,
          fullName,
          dateOfBirth: new Date(dateOfBirth),
          updatedAt: new Date(),
          createdAt: new Date(),
        }

        fakeUserServiceUpdateUserById = sinon.replace(
          userService,
          'updateUserById',
          fake.resolves(userServiceResult)
        )

        updateUserByIdWithStub = updateUserById(userService)
      })

      after(() => {
        sinon.restore()
      })

      it('should update user by id', async () => {
        const userId = 1
        const username = 'test_username'

        const mockRequest = {
          params: { id: userId },
          body: { username },
        } as unknown as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await updateUserByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(fakeUserServiceUpdateUserById, userId, { username })
      })

      it('should return a 200 code', async () => {
        const userId = 1
        const username = 'test_username'

        const mockRequest = {
          params: { id: userId },
          body: { username },
        } as unknown as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await updateUserByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 200)
      })
    })

    describe('user not found', () => {
      before(() => {
        let userServiceResult = null

        fakeUserServiceGetUserById = sinon.replace(
          userService,
          'updateUserById',
          fake.resolves(userServiceResult)
        )

        updateUserByIdWithStub = updateUserById(userService)
      })

      after(() => {
        sinon.restore()
      })

      it('should return null', async () => {
        const userId = 1
        const username = 'test username'

        const mockRequest = {
          params: { id: userId },
          body: { username },
        } as unknown as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await updateUserByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.json, { data: null })
      })

      it('should return a 404 code', async () => {
        const userId = 1
        const username = 'test username'

        const mockRequest = {
          params: { id: userId },
          body: { username },
        } as unknown as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await updateUserByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 404)
      })
    })
  })

  describe('#deleteUserById', () => {
    describe('user found', () => {
      before(() => {
        let id = 1
        let username = 'test_username'
        let email = 'test@test.com'
        let fullName = 'Locker Challenge'
        let dateOfBirth = '2023-08-12'

        let userServiceResult = {
          id,
          username,
          email,
          fullName,
          dateOfBirth: new Date(dateOfBirth),
          updatedAt: new Date(),
          createdAt: new Date(),
        }

        fakeUserServiceDeleteUserById = sinon.replace(
          userService,
          'deleteUserById',
          fake.resolves(userServiceResult)
        )

        deleteUserByIdWithStub = deleteUserById(userService)
      })

      after(() => {
        sinon.restore()
      })

      it('should delete user by id', async () => {
        const userId = 1

        const mockRequest = {
          params: { id: userId },
        } as unknown as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await deleteUserByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(fakeUserServiceDeleteUserById, userId)
      })

      it('should return a 200 code', async () => {
        const userId = 1

        const mockRequest = {
          params: { id: userId },
        } as unknown as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await deleteUserByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 200)
      })
    })

    describe('user not found', () => {
      before(() => {
        fakeUserServiceGetUserById = sinon.replace(
          userService,
          'deleteUserById',
          fake.throws(
            new PrismaClientKnownRequestError('No record found', {
              code: 'P2025',
              clientVersion: 'SomeClientVersion',
            })
          )
        )

        deleteUserByIdWithStub = deleteUserById(userService)
      })

      after(() => {
        sinon.restore()
      })

      it('should return a 404 code', async () => {
        const userId = 1

        const mockRequest = {
          params: { id: userId },
        } as unknown as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await deleteUserByIdWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 404)
      })
    })
  })

  describe('#getUserPosts', () => {
    describe('user with posts found', () => {
      var posts: Post[]

      before(() => {
        let userId = 1

        posts = [
          {
            id: 1,
            title: 'title',
            description: 'description',
            userId,
            updatedAt: new Date(),
            createdAt: new Date(),
          },
          {
            id: 2,
            title: 'title',
            description: 'description',
            userId,
            updatedAt: new Date(),
            createdAt: new Date(),
          },
        ]

        fakeUserServiceUserPosts = sinon.replace(userService, 'getUserPosts', fake.resolves(posts))

        getUserPostsWithStub = getUserPosts(userService)
      })

      after(() => {
        sinon.restore()
      })

      it('should return a 200 code', async () => {
        const userId = 1

        const mockRequest = {
          params: { id: userId },
        } as unknown as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await getUserPostsWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 200)
        sinon.assert.calledWith(mockResponse.json, { data: { posts } })
      })
    })

    describe('user with no posts', () => {
      before(() => {
        let posts: Post[] = []

        fakeUserServiceUserPosts = sinon.replace(userService, 'getUserPosts', fake.resolves(posts))

        getUserPostsWithStub = getUserPosts(userService)
      })

      after(() => {
        sinon.restore()
      })

      it('should return a 200 code', async () => {
        const userId = 1

        const mockRequest = {
          params: { id: userId },
        } as unknown as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await getUserPostsWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.status, 200)
      })

      it('should return an empty array', async () => {
        const userId = 1

        const mockRequest = {
          params: { id: userId },
        } as unknown as Request

        const mockResponse: any = {
          send: stub().returnsThis(),
          status: stub().returnsThis(),
          json: stub().returnsThis(),
        }

        await getUserPostsWithStub(mockRequest, mockResponse)

        sinon.assert.calledWith(mockResponse.json, { data: { posts: [] } })
      })
    })
  })
})
