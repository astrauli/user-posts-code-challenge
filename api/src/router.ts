import BodyParser from 'body-parser'
import Router from 'express-promise-router'
import UserRoute from './routes/userRoute'

const router = Router()

router.use(BodyParser.json())

router.use('/api/users', UserRoute)

export default router
