import { describe } from 'mocha'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { prisma } from '../../src/prisma'
import UserRepository from '../../src/repositories/userRepository'
import { Post, User } from '@prisma/client'

chai.use(chaiAsPromised)

describe('UserRepository', () => {
  let userRepository: UserRepository

  let sharedUser: User

  let sharedUserUsername = 'test_username1'
  let sharedUserEmail = 'test@test1.com'
  let sharedUserFullName = 'test fullname'
  let sharedUserDateOfBirth = new Date().toISOString()
  let sharedUserId: number

  let sharedPostTitle = 'shared post title'
  let sharedPostDescription = 'shared post description'

  beforeEach(async () => {
    sharedUser = await prisma.user.create({
      data: {
        username: sharedUserUsername,
        email: sharedUserEmail,
        fullName: sharedUserFullName,
        dateOfBirth: sharedUserDateOfBirth,
        posts: {
          create: {
            title: sharedPostTitle,
            description: sharedPostDescription,
          },
        },
      },
      include: {
        posts: true,
      },
    })

    sharedUserId = sharedUser.id

    userRepository = new UserRepository(prisma.user)
  })

  afterEach(async () => {
    const deleteUsers = prisma.user.deleteMany()
    const deletePosts = prisma.post.deleteMany()
    await prisma.$transaction([deleteUsers, deletePosts])
  })

  after(async () => {
    await prisma.$disconnect()
  })

  describe('#createUser', () => {
    it('should create a user', async () => {
      const date = new Date().toISOString()

      let username = 'test_username2'
      let email = 'test@test.com2'
      let fullName = 'full name'
      let dateOfBirth = date

      let newUser = await userRepository.createUser({
        username,
        email,
        fullName,
        dateOfBirth,
      })

      expect(newUser.email).equal(email)
      expect(newUser.username).equal(username)
      expect(newUser.fullName).equal(fullName)
    })
  })

  describe('#getUserById', () => {
    it('should fetch a user', async () => {
      const userFetched = await userRepository.getUserById(sharedUserId)

      expect(userFetched.email).equal(sharedUserEmail)
      expect(userFetched.username).equal(sharedUserUsername)
      expect(userFetched.fullName).equal(sharedUserFullName)
    })
  })

  describe('#getUserPosts', () => {
    it('should return a list of posts', async () => {
      const posts = await userRepository.getUserPosts(sharedUserId)

      expect(posts.length).to.equal(1)
      expect(posts[0].title).to.equal(sharedPostTitle)
      expect(posts[0].description).to.equal(sharedPostDescription)
    })
  })

  describe('#updateUserById', () => {
    it('should return a user', async () => {
      const updatedEmail = 'updatedEmail@test.com'

      const data = {
        email: updatedEmail,
      }

      const updatedUser = await userRepository.updateUserById(sharedUserId, data)

      expect(updatedUser.email).equal(updatedEmail)
      expect(updatedUser.username).equal(sharedUserUsername)
      expect(updatedUser.fullName).equal(sharedUserFullName)

      sharedUserEmail = updatedEmail
    })
  })

  describe('#deleteUserById', () => {
    it('should return a user', async () => {
      const deletedUser = await userRepository.deleteUserById(sharedUserId)

      expect(deletedUser.email).equal(sharedUserEmail)
      expect(deletedUser.username).equal(sharedUserUsername)
      expect(deletedUser.fullName).equal(sharedUserFullName)
    })
  })
})
