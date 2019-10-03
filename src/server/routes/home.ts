import express from 'express'
import * as controller from '../controllers/home'
const router = express.Router()

router.use(controller.showPage)

export default router
