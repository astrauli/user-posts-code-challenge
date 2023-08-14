import { describe } from 'mocha'
import chai, { expect } from 'chai'
import sinon, { SinonSpy, fake, stub } from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import { Request } from 'express'
import { prisma } from '../../src/prisma'
import { createUser } from '../../src/controllers/userController'
import UserService from '../../src/services/userService'
import UserRepository from '../../src/repositories/userRepository'

chai.use(chaiAsPromised)

describe('UserController', () => {
  var userRepository: UserRepository
  var userService: UserService

  var createUserWithStub: Function
  var fakeUserServiceCreateUser: SinonSpy

  beforeEach(() => {
    userRepository = new UserRepository(prisma.user)
    userService = new UserService(userRepository)

    let id = 1
    let username = 'test_username'
    let email = 'test@test.com'
    let fullName = 'Locker Challenge'
    let dateOfBirth = '2023-08-12'

    let userCreated = {
      id,
      username,
      email,
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      updatedAt: new Date(),
      createdAt: new Date(),
    }

    fakeUserServiceCreateUser = sinon.replace(userService, 'createUser', fake.resolves(userCreated))

    createUserWithStub = createUser(userService)
  })

  describe('#createUser', () => {
    it('should return pass the correct user params to the user service', async () => {
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

      expect(mockResponse.status.calledWith(201)).to.be.true
    })
  })
})
