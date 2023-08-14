import { Router } from 'express'

import { createUser, getUserById, updateUserById } from '../controllers/userController'

const router = Router()

router.post('/', createUser())
router.get('/:id', getUserById())
router.put('/:id', updateUserById())

export default router
