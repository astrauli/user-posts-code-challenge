import { Router } from 'express'

import { getPostById, updatePostById, deletePostById } from '../controllers/postController'

const router = Router()

router.get('/:id', getPostById())
router.put('/:id', updatePostById())
router.delete('/:id', deletePostById())

export default router
