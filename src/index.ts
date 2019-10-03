import utils from './utils'
import Server from './server'
const debug = utils.debug('root')
debug('Booting up...')
const server = new Server()
server.start()
