import express from 'express'
import * as controller from '../../controllers/api/books'
const router = express.Router()

router.get('/mine', controller.mybooks)

router.get('/browse', controller.getAllBooks)

export default router
