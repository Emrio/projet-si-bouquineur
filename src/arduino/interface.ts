import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'
import utils from '../utils'
const debug = utils.debug('arduino-io')
const arduinoOut = utils.debug('arduino-stdout')

const port = new SerialPort(utils.config.arduino.path, { baudRate: utils.config.arduino.baudRate })
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))

let state = 0

port.on('open', () => {
  debug('Connected to Arduino!')
})

parser.on('data', (data: string) => {
  arduinoOut(data)
})

function sendCommand (cmd: string) {
  return new Promise((resolve, reject) => {
    port.write(cmd + '\n', (err) => {
      if (err) return reject(err)
      debug('Command sent: %o', cmd)
      resolve()
    })
  })
}

function listenResponse (timeout: number = 60000): Promise<string> {
  return new Promise((resolve, reject) => {
    const tempListener = port.pipe(new Readline({ delimiter: '\r\n' }))
    tempListener.on('data', (data: string) => {
      if (data.startsWith('NODE:')) {
        const response = data.slice('NODE:'.length)
        debug('Received response from Arduino: %o', response)
        tempListener.removeAllListeners()
        resolve(response)
      }
    })
    setTimeout(() => {
      tempListener.removeAllListeners()
      reject(new Error('Timeout on receive command acknowledgment'))
    }, timeout)
  })
}

export async function getBook (id: number): Promise<boolean> {
  try {
    if (state !== 0) throw new Error('Busy, try again later')
    state = 1
    await sendCommand('BOOK REQUEST')
    if (await listenResponse() !== 'LISTENING') throw new Error('Arduino did not understand request')
    await sendCommand(id.toString())
    if (await listenResponse() !== 'SEARCHING') throw new Error('Arduino did not understand book id')
    const success = await listenResponse() === 'FOUND'
    state = 0
    return success
  } catch (e) {
    console.error(e)
    state = 0
    throw e
  }
}
