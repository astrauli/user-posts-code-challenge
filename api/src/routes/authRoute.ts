import { Router } from 'express'
import passport from '../auth/passport'
import { generateSaltHashFromPassword } from '../auth/util'
import { prisma } from '../prisma'

const router = Router()

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ success: true })
})

router.post('/signup', async (req, res, next) => {
  const { password, username } = req.body

  if (await prisma.user.findFirst({ where: { username } })) {
    res.status(400).json({ error: 'User with that username exists' })
    return
  }

  const { salt, hash } = generateSaltHashFromPassword(password)

  await prisma.user.create({
    data: {
      username,
      hash,
      salt,
    },
  })

  res.status(201).json({ success: true })
})

export default router
