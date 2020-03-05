import mongoose from 'mongoose'
import express from 'express'
import morgan from 'morgan'
import session from 'express-session'
import bodyParser from 'body-parser'
import mongodbstore from 'connect-mongodb-session'
import passport from 'passport'
import moment from 'moment'
import chalk from 'chalk'
import http from 'http'
import socketIO from 'socket.io'
import utils from '../utils'
import routes from './routes'
import middlewares from './middlewares'
import { socketting } from './socket'
import './authentication'
const debug = utils.debug('server')
const MongoDBStore = mongodbstore(session)

export default class Server {
  private server = express()
  private httpServer = new http.Server(this.server)
  public io = socketIO(this.httpServer)
  private session: express.RequestHandler

  constructor () {
    mongoose.connect(utils.config.database.urls.default, utils.config.database.config)

    this.session = session({
      secret: utils.config.session.secret === 'random' ? utils.random(true) : utils.config.session.secret,
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false, domain: utils.config.hostname },
      store: new MongoDBStore({
        uri: utils.config.database.urls.default,
        collection: 'sessions'
      })
    })

    // disabling etag disables express' built-in cache system
    // this.server.disable('etag')
    this.server.set('env', utils.config.env)
    this.server.set('port', utils.config.port)
    this.server.set('hostname', utils.config.hostname)
    this.server.set('views', utils.config.paths.views)
    this.server.set('view engine', utils.config.viewEngine)
    this.server.use(bodyParser.json())
    this.server.use(bodyParser.urlencoded({ extended: true }))
    this.server.use(this.session)
    this.server.use(passport.initialize())
    this.server.use(passport.session())
    middlewares(this.server)

    // log management
    if (utils.config.log === 'self') {
      morgan.token('protocol', req => req.secure || req.get('x-forwarded-proto') || req.protocol === 'https' ? chalk.green('HTTPS') : chalk.gray('HTTP'))
      morgan.token('date', () => moment().format('DD-MM-YYYY HH:mm:ss'))
      morgan.token('status', (_, res) => chalk[res.statusCode >= 500 ? 'bgRed' : res.statusCode >= 400 ? 'yellow' : res.statusCode >= 300 ? 'cyan' : res.statusCode >= 200 ? 'green' : 'white'](res.statusCode.toString()))
      this.server.use(morgan(`[:date][${utils.config.version}] ${chalk.red(':remote-addr')} - ${chalk.bold(':method')} ${chalk.blue(':url')} using :protocol/:http-version -> :status in :response-time ms (agent: ${chalk.magenta('":user-agent"')}, from: ${chalk.yellow('":referrer"')})`))
    } else {
      require(utils.config.log)(this.server, utils.config.name)
    }

    debug('Setting up routes...')
    routes.setOn(this.server)

    debug('Setting up socket...')
    socketting(this.io)
  }

  public start () {
    const port = this.server.get('port')
    this.httpServer.listen(port, () => {
      debug('Server listening on port %o', port)
    })
  }
}
