import { Arduino } from '.'
import { delay } from './board';

export class Arm {
  private servoPin: number = 6

  constructor (private arduino: Arduino) {}

  async extend () {
    for (let position = 80; position <= 180; position++) {
      this.arduino.board.servoWrite(this.servoPin, position)
      await delay(15)
    }
  }

  retract () {
    this.arduino.board.servoWrite(this.servoPin, 80)
  }
}
