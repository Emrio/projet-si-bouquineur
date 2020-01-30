import utils from '../utils'
import { Arduino } from '.'
import { SERIAL_PORT_ID } from './board'

export class RFID {
  private portId: SERIAL_PORT_ID
  private rfid: string = ''

  constructor (private arduino: Arduino) {
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
        this.rfid = rfid
      } else {
        rfid += String.fromCharCode(data[0])
      }
    }) as any)
  }

  get currentRFID (): string {
    return this.rfid
  }
}
