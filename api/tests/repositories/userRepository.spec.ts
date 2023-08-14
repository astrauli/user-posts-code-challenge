import { describe } from 'mocha'
import chai, { assert } from 'chai'
import { replace, fake, SinonSpy } from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import { prisma } from '../../src/prisma'
import UserRepository from '../../src/repositories/userRepository'

chai.use(chaiAsPromised)

describe('UserRepository', () => {
  var userRepository: UserRepository
  var fakeCreate: SinonSpy

  beforeEach(() => {
    let userCreated = {
      id: 1,
      username: 'any',
      email: 'any',
      fullName: 'any',
      dateOfBirth: new Date(),
      updatedAt: new Date(),
      createdAt: new Date(),
    }

    fakeCreate = replace(prisma.user, 'create', fake.resolves(userCreated))

    userRepository = new UserRepository(prisma.user)
  })

  describe('#createUser', () => {
    it('should create a user', async () => {
      await userRepository.createUser({
        username: 'any',
        email: 'any',
        fullName: 'any',
        dateOfBirth: 'any',
      })

      assert.equal(fakeCreate.callCount, 1)
    })
  })
})
