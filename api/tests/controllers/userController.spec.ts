import { describe } from 'mocha'
import chai, { expect } from 'chai'
import sinon, { SinonSpy, fake, stub } from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import { Request } from 'express'
import { createUser, getUserById } from '../../src/controllers/userController'
import UserService from '../../src/services/userService'
import { getDefaultUserRepository } from '../../src/repositories/userRepository'

chai.use(chaiAsPromised)

describe('UserController', () => {
  var userService: UserService

  var createUserWithStub: Function
  var getUserByIdWithStub: Function
  var fakeUserServiceCreateUser: SinonSpy
  var fakeUserServiceGetUserById: SinonSpy

  before(() => {
    userService = new UserService(getDefaultUserRepository())
  })

  describe('#createUser', () => {
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
})
