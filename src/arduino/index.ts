import { EventEmitter } from 'events'
import utils from '../utils'
import { Arm } from './Arm'
import { BarCodeReader } from './BarCodeReader'
import { board, delay } from './board'
import { RFID } from './RFID'
import { StepMotor } from './StepMotor'
const debug = utils.debug('arduino')

export class Arduino extends EventEmitter {
  public board = board(utils.config.arduino.path)
  public arm = new Arm(this)
  public barCodeReader = new BarCodeReader(this)
  public rfid = new RFID(this)
  public stepper = new StepMotor(this)

  constructor () {
    super()
    this.board.on('ready', () => this.main())
  }

  private main (): void {
    debug('Ready!')
    this.rfid.load()
    this.rfidEvents()
  }

  private rfidEvents (): void {
    this.rfid.on('rfidReceived', (rfid: string, isNew: boolean) => {
      if (isNew) this.emit('rfidUpdate', rfid)
    })
  }

  async getBook (id: string): Promise<boolean> {
    debug('Getting book...')
    let directSense = true
    while (await this.barCodeReader.getCode() !== id) {
      await this.stepper.step(!directSense)
      if (this.stepper.reachedEdge() && directSense === false) {
        debug('Could not find book!')
        return false // Could not find it :(
      } else if (this.stepper.reachedEdge()) {
        debug('Could not found in the first direction, returning and trying again...')
        directSense = false
      }
      await delay(1)
    }
    await this.arm.extend()
    await delay(1000)
    this.arm.retract()
    await this.stepper.reset()
    return true
  }
}

export const arduino = new Arduino()
