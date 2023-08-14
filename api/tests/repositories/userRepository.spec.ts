import { describe } from 'mocha'
import chai from 'chai'
import sinon, { replace, fake, SinonSpy } from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import { prisma } from '../../src/prisma'
import UserRepository from '../../src/repositories/userRepository'

chai.use(chaiAsPromised)

describe('UserRepository', () => {
  var userRepository: UserRepository
  var fakeCreate: SinonSpy
  var fakeFindUniqueById: SinonSpy
  var fakeUpdateById: SinonSpy

  before(() => {
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
    fakeFindUniqueById = replace(prisma.user, 'findUnique', fake.resolves(userCreated))
    fakeUpdateById = replace(prisma.user, 'update', fake.resolves(userCreated))

    userRepository = new UserRepository(prisma.user)
  })

  describe('#createUser', () => {
    it('should create a user', async () => {
      let username = 'input username'
      let email = 'input email'
      let fullName = 'input fullName'
      let dateOfBirth = 'input dateOfBirth'

      await userRepository.createUser({
        username,
        email,
        fullName,
        dateOfBirth,
      })

      sinon.assert.calledOnce(fakeCreate)
      sinon.assert.calledWith(fakeCreate, {
        data: {
          username,
          email,
          fullName,
          dateOfBirth,
        },
      })
    })
  })

  describe('#getUserById', () => {
    it('should fetch a user', async () => {
      await userRepository.getUserById(1)

      sinon.assert.calledOnce(fakeFindUniqueById)
      sinon.assert.calledWith(fakeFindUniqueById, { where: { id: 1 } })
    })
  })

  describe('#updateUserById', () => {
    it('should return a user', async () => {
      let username = 'input username'
      let email = 'input email'
      let fullName = 'input fullName'
      let dateOfBirth = 'input dateOfBirth'

      let data = {
        username,
        email,
        fullName,
        dateOfBirth,
      }

      await userRepository.updateUserById(1, data)

      sinon.assert.calledOnce(fakeUpdateById)
      sinon.assert.calledWith(fakeUpdateById, { where: { id: 1 }, data })
    })
  })
})
