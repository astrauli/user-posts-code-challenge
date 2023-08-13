import BodyParser from 'body-parser'
import Router from 'express-promise-router'
import UserRouter from './routers/userRouter'

const router = Router()

router.use(BodyParser.json())

router.use('/api/users', UserRouter)

export default router
