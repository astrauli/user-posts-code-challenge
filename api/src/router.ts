import BodyParser from 'body-parser'
import Router from 'express-promise-router'
import cors from 'cors'
import UserRoute from './routes/userRoute'
import PostRoute from './routes/postRoute'
import AuthRoute from './routes/authRoute'

const router = Router()

router.use(cors())
router.use(BodyParser.json())

router.use('/api/users', UserRoute)
router.use('/api/posts', PostRoute)
router.use('/api/auth', AuthRoute)

export default router
