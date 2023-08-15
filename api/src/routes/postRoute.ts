import { Router } from 'express'

import {
  getPostById,
  updatePostById,
  deletePostById,
  createPostByUserId,
} from '../controllers/postController'

const router = Router()

router.post('/', createPostByUserId())
router.get('/:id', getPostById())
router.put('/:id', updatePostById())
router.delete('/:id', deletePostById())

export default router
