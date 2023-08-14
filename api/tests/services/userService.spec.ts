import { describe } from 'mocha'
import chai, { expect } from 'chai'
import sinon, { fake } from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import { prisma } from '../../src/prisma'
import UserRepository from '../../src/repositories/userRepository'
import UserService from '../../src/services/userService'
import { ValidationError } from '../../src/util/validations/ValidationError'

chai.use(chaiAsPromised)

describe('UserService', () => {
  var userService: UserService
  var userRepository: UserRepository

  before(() => {
    userRepository = new UserRepository(prisma.user)
    userService = new UserService(userRepository)
  })

  describe('#createUser', () => {
    afterEach(() => {
      sinon.restore()
    })

    describe('input validation', () => {
      it('should return a ValidationError on invalid email', async () => {
        let badEmail = 'test'

        let id = 1
        let username = 'test_username'
        let fullName = 'Locker Challenge'
        let dateOfBirth = '2023-08-12'

        let userInput = {
          id,
          username,
          email: badEmail,
          fullName,
          dateOfBirth,
        }

        let response = await userService.createUser(userInput)

        expect(response).to.be.instanceOf(ValidationError)
      })

      it('should return a ValidationError on null email', async () => {
        let badEmail = null

        let id = 1
        let username = 'test_username'
        let fullName = 'Locker Challenge'
        let dateOfBirth = '2023-08-12'

        let userInput = {
          id,
          username,
          email: badEmail,
          fullName,
          dateOfBirth,
        }

        let response = await userService.createUser(userInput)

        expect(response).to.be.instanceOf(ValidationError)
      })

      it('should return a ValidationError on null username', async () => {
        let badUsername = null

        let id = 1
        let fullName = 'Locker Challenge'
        let email = 'test@test.com'
        let dateOfBirth = '2023-08-12'

        let userInput = {
          id,
          username: badUsername,
          email,
          fullName,
          dateOfBirth,
        }

        let response = await userService.createUser(userInput)

        expect(response).to.be.instanceOf(ValidationError)
      })
    })

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
    afterEach(() => {
      sinon.restore()
    })

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

  describe('#updateUserById', () => {
    afterEach(() => {
      sinon.restore()
    })

    describe('input validation', () => {
      it('should return a ValidationError on invalid email', async () => {
        let badEmail = 'test'

        let data = { email: badEmail }

        let response = await userService.updateUserById(1, data)

        expect(response).to.be.instanceOf(ValidationError)
      })
    })

    it('should return a user', async () => {
      let id = 1
      let username = 'test_username'
      let email = 'test@test.com'
      let fullName = 'Locker Challenge'
      let dateOfBirth = '2023-08-12'

      let data = {
        username,
      }

      let userUpdated = {
        id,
        email,
        fullName,
        ...data,
        dateOfBirth: new Date(dateOfBirth),
        updatedAt: new Date(),
        createdAt: new Date(),
      }

      sinon.replace(userRepository, 'updateUserById', fake.resolves(userUpdated))

      let user = await userService.updateUserById(id, data)

      expect(user).to.deep.equal(userUpdated)
    })
  })

  describe('#deleteUserById', () => {
    afterEach(() => {
      sinon.restore()
    })

    it('should return a user', async () => {
      let id = 1
      let username = 'test_username'
      let email = 'test@test.com'
      let fullName = 'Locker Challenge'
      let dateOfBirth = '2023-08-12'

      let data = {
        username,
      }

      let userUpdated = {
        id,
        email,
        fullName,
        ...data,
        dateOfBirth: new Date(dateOfBirth),
        updatedAt: new Date(),
        createdAt: new Date(),
      }

      sinon.replace(userRepository, 'updateUserById', fake.resolves(userUpdated))

      let user = await userService.updateUserById(id, data)

      expect(user).to.deep.equal(userUpdated)
    })
  })
})
