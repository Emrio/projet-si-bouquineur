import express from 'express'
import boards from './boards'
import books from './books'
import users from './users'
const router = express.Router()

router.use('/boards/', boards)

router.use('/books/', books)

router.use('/users/', users)

export default router
