import { Router } from 'express'

import {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} from '../controllers/userController'

const router = Router()

router.post('/', createUser())
router.get('/:id', getUserById())
router.put('/:id', updateUserById())
router.delete('/:id', deleteUserById())

export default router
