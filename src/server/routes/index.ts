import express from 'express'
import utils from '../../utils'
import home from './home'
import api from './api'

export default class Routes {
  static setOn (server: express.Application) {
    // static file server as /assets
    server.use('/assets', express.static(utils.config.paths.public))
    server.use('/api', api)
    server.use(home)
  }
}
