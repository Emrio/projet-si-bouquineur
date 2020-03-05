import { arduino } from '../arduino'
import utils from '../utils'
const debug = utils.debug('socket')

export function socketting (io: SocketIO.Server): void {
  io.on('connection', (_socket) => {
    debug('new connection')
  })

  arduino.on('rfidUpdate', rfid => {
    debug({ rfid })
    io.emit('login', rfid)
  })
}
