import { Router } from 'express'
import passport from '../auth/passport'
import { generateSaltHashFromPassword } from '../auth/util'
import { prisma } from '../prisma'

const router = Router()

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/signup',
  }),
  (req, res) => {
    res.status(200).send()
  }
)

router.post('/signup', async (req, res, next) => {
  const saltHash = generateSaltHashFromPassword(req.body.password)

  const salt = saltHash.salt
  const hash = saltHash.hash
  const newUser = await prisma.user.create({
    data: {
      username: req.body.username,
      hash: hash,
      salt: salt,
    },
  })

  res.status(201).send()
})

export default router
