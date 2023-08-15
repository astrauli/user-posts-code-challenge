import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { prisma } from '../prisma'
import { User } from '@prisma/client'
import { isValidPassword } from './util'

passport.use(
  new LocalStrategy(async (username: string, password: string, done: Function) => {
    let user: User

    try {
      user = await prisma.user.findUnique({ where: { username } })
    } catch (e) {
      return done(e)
    }

    if (user == null) return done(null, false)

    if (!isValidPassword(password, user.hash, user.salt)) return done(null, false)

    return done(null, user)
  })
)

passport.serializeUser((user: User, done: Function) => {
  done(null, user.id)
})

passport.deserializeUser(async (id: number, done: Function) => {
  let user: User

  try {
    user = await prisma.user.findUnique({ where: { id } })
  } catch (e) {
    done(e, null)
  }

  done(null, user)
})

export default passport
