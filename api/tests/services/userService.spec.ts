import { describe } from 'mocha'
import chai, { expect } from 'chai'
import sinon, { fake } from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import { Post } from '@prisma/client'
import { prisma, UserWithoutSensitiveFields } from '../../src/prisma'
import UserRepository from '../../src/repositories/userRepository'
import UserService from '../../src/services/userService'
import { ValidationError } from '../../src/util/validations/ValidationError'

import CreateUserInput from '../../src/types/CreateUserInput'

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
        const badEmail = 'test'

        const userInput = defaultUserInput({ ...{ email: badEmail } })

        const response = await userService.createUser(userInput)

        expect(response).to.be.instanceOf(ValidationError)
      })

      it('should return a ValidationError on null email', async () => {
        const badEmail = null

        const userInput = defaultUserInput({ ...{ email: badEmail } })

        const response = await userService.createUser(userInput)

        expect(response).to.be.instanceOf(ValidationError)
      })

      it('should return a ValidationError on undefined email', async () => {
        const badEmail = undefined

        const userInput = defaultUserInput({ ...{ email: badEmail } })

        const response = await userService.createUser(userInput)

        expect(response).to.be.instanceOf(ValidationError)
      })

      it('should return a ValidationError on null username', async () => {
        const badUsername = null

        const userInput = defaultUserInput({ ...{ username: badUsername } })

        const response = await userService.createUser(userInput)

        expect(response).to.be.instanceOf(ValidationError)
      })

      it('should return a ValidationError on undefined username', async () => {
        const badUsername = undefined

        const userInput = defaultUserInput({ ...{ username: badUsername } })

        const response = await userService.createUser(userInput)

        expect(response).to.be.instanceOf(ValidationError)
      })
    })

    it('should return a user', async () => {
      const id = 1
      const dateOfBirth = '2023-08-12'

      const userInput = defaultUserInput({ ...{ dateOfBirth } })

      const userCreated = {
        id,
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
      const id = 1

      const userFound = defaultUser()

      sinon.replace(userRepository, 'getUserById', fake.resolves(userFound))

      const user = await userService.getUserById(id)

      expect(user).to.deep.equal(userFound)
    })

    it('should return null if no user is found', async () => {
      sinon.replace(userRepository, 'getUserById', fake.resolves(null))

      const user = await userService.getUserById(1)

      expect(user).to.equal(null)
    })
  })

  describe('#updateUserById', () => {
    afterEach(() => {
      sinon.restore()
    })

    describe('input validation', () => {
      it('should return a ValidationError on invalid email', async () => {
        const badEmail = 'test'

        const data = { email: badEmail }

        const response = await userService.updateUserById(1, data)

        expect(response).to.be.instanceOf(ValidationError)
      })
    })

    it('should return a user', async () => {
      const id = 1
      const username = 'test_username'
      const email = 'test@test.com'
      const fullName = 'Locker Challenge'
      const dateOfBirth = '2023-08-12'

      const data = {
        username,
      }

      const userUpdated = {
        id,
        email,
        fullName,
        ...data,
        dateOfBirth: new Date(dateOfBirth),
        updatedAt: new Date(),
        createdAt: new Date(),
      }

      sinon.replace(userRepository, 'updateUserById', fake.resolves(userUpdated))

      const user = await userService.updateUserById(id, data)

      expect(user).to.deep.equal(userUpdated)
    })
  })

  describe('#deleteUserById', () => {
    afterEach(() => {
      sinon.restore()
    })

    it('should return a user', async () => {
      const id = 1
      const username = 'test_username'
      const email = 'test@test.com'
      const fullName = 'Locker Challenge'
      const dateOfBirth = '2023-08-12'

      const data = {
        username,
      }

      const userUpdated = {
        id,
        email,
        fullName,
        ...data,
        dateOfBirth: new Date(dateOfBirth),
        updatedAt: new Date(),
        createdAt: new Date(),
      }

      sinon.replace(userRepository, 'updateUserById', fake.resolves(userUpdated))

      const user = await userService.updateUserById(id, data)

      expect(user).to.deep.equal(userUpdated)
    })
  })

  describe('#getUserPosts', () => {
    afterEach(() => {
      sinon.restore()
    })

    it('should return a list of posts', async () => {
      const userId = 1

      const posts: Post[] = [
        {
          id: 1,
          title: 'title',
          description: 'description',
          userId,
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ]

      sinon.replace(userRepository, 'getUserPosts', fake.resolves(posts))

      const result = await userService.getUserPosts(userId)

      expect(result).to.deep.equal(posts)
    })
  })
})

const defaultUser = (
  overrides?: Partial<UserWithoutSensitiveFields>
): UserWithoutSensitiveFields => {
  const now = new Date()

  const defaultValues: UserWithoutSensitiveFields = {
    id: 1,
    fullName: 'Default fullName',
    email: 'defaultEmail@test.com',
    username: 'default_username',
    dateOfBirth: now,
    updatedAt: now,
    createdAt: now,
  }

  return { ...defaultValues, ...overrides }
}

const defaultUserInput = (overrides?: Partial<CreateUserInput>): CreateUserInput => {
  const now = new Date()

  const defaultValues: CreateUserInput = {
    fullName: 'Default fullName',
    email: 'defaultEmail@test.com',
    username: 'default_username',
    dateOfBirth: now.toISOString(),
  }

  return { ...defaultValues, ...overrides }
}
