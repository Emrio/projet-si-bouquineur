import express from 'express'
import * as controller from '../../controllers/api/users'
const router = express.Router()

router.get('/myinfo', controller.myinfo)

export default router
