import { EventEmitter } from 'events'
import utils from '../utils'
import { Arduino } from '.'
import { SERIAL_PORT_ID } from './board'

export class RFID extends EventEmitter {
  private portId: SERIAL_PORT_ID
  private rfid: string = ''
  private rfidGotTimestamp: number = 0

  constructor (private arduino: Arduino) {
    super()
    this.portId = arduino.board.SERIAL_PORT_IDs.DEFAULT
  }

  load () {
    this.arduino.board.serialConfig({
      portId: this.portId,
      baud: utils.config.arduino.baudRate,
      rxPin: 2,
      txPin: 3
    })
    this.updateRFID()
  }

  private updateRFID (): void {
    const board = this.arduino.board
    let rfid: string = ''
    board.serialRead(this.portId, 0, ((data: [number]) => {
      if (data[0] === 2) {
        rfid = ''
      } else if (data[0] === 3) {
        this.emit('rfidReceived', rfid, this.rfid !== rfid)
        this.rfid = rfid
        this.rfidGotTimestamp = Date.now()
      } else {
        rfid += String.fromCharCode(data[0])
      }
    }) as any)
  }

  get currentRFID (): string {
    return Date.now() < this.rfidGotTimestamp + 2000 ? this.rfid : ''
  }

  public resetRFID (): void {
    this.rfid = ''
  }
}
