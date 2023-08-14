import { describe } from 'mocha'
import chai, { expect } from 'chai'
import sinon, { fake } from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import { prisma } from '../../src/prisma'
import UserRepository from '../../src/repositories/userRepository'
import UserService from '../../src/services/userService'

chai.use(chaiAsPromised)

describe('UserService', () => {
  var userService: UserService
  var userRepository: UserRepository

  before(() => {
    userRepository = new UserRepository(prisma.user)
    userService = new UserService(userRepository)
  })

  afterEach(() => {
    sinon.restore()
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

  describe('#getUserById', () => {
    it('should return a user if found', async () => {
      let id = 1
      let username = 'test_username'
      let email = 'test@test.com'
      let fullName = 'Locker Challenge'
      let dateOfBirth = '2023-08-12'

      let userFound = {
        id,
        username,
        email,
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        updatedAt: new Date(),
        createdAt: new Date(),
      }

      sinon.replace(userRepository, 'getUserById', fake.resolves(userFound))

      let user = await userService.getUserById(id)

      expect(user).to.deep.equal(userFound)
    })

    it('should return null if no user is found', async () => {
      sinon.replace(userRepository, 'getUserById', fake.resolves(null))

      let user = await userService.getUserById(1)

      expect(user).to.equal(null)
    })
  })
})
