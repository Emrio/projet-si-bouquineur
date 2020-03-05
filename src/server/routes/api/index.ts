import express from 'express'
import boards from './boards'
import auth from './auth'
const router = express.Router()

router.use('/boards/', boards)

router.use('/auth/', auth)

export default router
