import { describe } from 'mocha'
import chai, { assert, expect } from 'chai'
import sinon, { SinonSpy, fake } from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import { prisma } from '../../src/prisma'
import UserRepository from '../../src/repositories/userRepository'
import UserService from '../../src/services/userService'

chai.use(chaiAsPromised)

describe('UserService', () => {
  var userService: UserService
  var userRepository: UserRepository

  beforeEach(() => {
    userRepository = new UserRepository(prisma.user)
    userService = new UserService(userRepository)
  })

  describe('#createUser', () => {
    it('should return a user', async () => {
      let id = 1
      let username = 'test_username'
      let email = 'test@test.com'
      let fullName = 'Locker Challenge'
      let dateOfBirth = '2023-08-12'

      let userInput = {
        id,
        username,
        email,
        fullName,
        dateOfBirth,
      }

      let userCreated = {
        ...userInput,
        dateOfBirth: new Date(dateOfBirth),
        updatedAt: new Date(),
        createdAt: new Date(),
      }

      sinon.replace(userRepository, 'createUser', fake.resolves(userCreated))

      let user = await userService.createUser(userInput)

      expect(user).to.deep.equal(userCreated)
    })
  })
})
