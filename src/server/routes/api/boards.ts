import express from 'express'
import * as controller from '../../controllers/api/boards'
const router = express.Router()

router.get('/home', controller.getWelcomePage)

router.get('/dashboard', controller.getDashboard)

router.get('/browse', controller.browseLibrary)

router.get('/borrowed', controller.myBooks)

export default router
