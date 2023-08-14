import { describe } from 'mocha'
import chai from 'chai'
import sinon, { replace, fake, SinonSpy } from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import { prisma } from '../../src/prisma'
import UserRepository from '../../src/repositories/userRepository'
import { Post } from '@prisma/client'

chai.use(chaiAsPromised)

describe('UserRepository', () => {
  let userRepository: UserRepository

  let fakeCreate: SinonSpy
  let fakeFindUniqueById: SinonSpy
  let fakeUpdateById: SinonSpy
  let fakeDeleteById: SinonSpy

  before(() => {
    let user = {
      id: 1,
      username: 'any',
      email: 'any',
      fullName: 'any',
      posts: [
        { ...aPost({ id: 1 }) },
        { ...aPost({ id: 2 }) },
        { ...aPost({ id: 3 }) },
        { ...aPost({ id: 4 }) },
      ],
      updatedAt: new Date(),
      createdAt: new Date(),
    }

    fakeCreate = replace(prisma.user, 'create', fake.resolves(user))
    fakeFindUniqueById = replace(prisma.user, 'findUnique', fake.resolves(user))
    fakeUpdateById = replace(prisma.user, 'update', fake.resolves(user))
    fakeDeleteById = replace(prisma.user, 'delete', fake.resolves(user))

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

  describe('#deleteUserById', () => {
    it('should return a user', async () => {
      await userRepository.deleteUserById(1)

      sinon.assert.calledOnce(fakeDeleteById)
      sinon.assert.calledWith(fakeDeleteById, { where: { id: 1 } })
    })
  })

  describe('#getUserPosts', () => {
    it('should return a list of posts', async () => {
      await userRepository.getUserPosts(1)

      sinon.assert.calledWith(fakeFindUniqueById, {
        where: { id: 1 },
        include: {
          posts: {
            orderBy: {
              updatedAt: 'asc',
            },
          },
        },
      })
    })
  })
})

const aPost = (overrides?: Partial<Post>): Post => {
  const now = new Date()

  const defaultValues = {
    id: 1,
    title: 'title',
    description: 'description',
    userId: 1,
    updatedAt: now,
    createdAt: now,
  }

  return { ...defaultValues, ...overrides }
}
