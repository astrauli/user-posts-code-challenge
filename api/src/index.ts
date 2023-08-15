import express, { Express } from 'express'
import router from './router'
import { redisStore } from './auth/store'
import { createRedisClient } from './redis/redisClient'
import session from 'express-session'
import passport from './auth/passport'
import { RedisClientType } from 'redis'

const app: Express = express()
const port = 3000

createRedisClient().then((client) => {
  app.use(
    session({
      store: redisStore(client as RedisClientType),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1000 * 60 * 10, // 10 minutes
      },
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())
  app.use('/', router)
  app.listen(port, () => console.log(`app listening on port ${port}!`))
})
