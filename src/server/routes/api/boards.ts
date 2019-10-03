import express from 'express'
import * as controller from '../../controllers/api/boards'
const router = express.Router()

router.get('/welcome', controller.getWelcomePage)

router.get('/dashboard', controller.getDashboard)

export default router