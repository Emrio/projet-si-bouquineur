import express from 'express'
import boards from './boards'
const router = express.Router()

router.use('/boards/', boards)

export default router
