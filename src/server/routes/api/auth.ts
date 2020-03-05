import express from 'express'
import * as controller from '../../controllers/api/auth'
const router = express.Router()

router.post('/login', controller.login)

router.post('/logout', controller.logout)

export default router
