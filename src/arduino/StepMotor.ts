import { Arduino } from '.'
import { delay } from './board'

export class StepMotor {
  constructor (private arduino: Arduino) {}

  private speed: number = 1
  private position: number = 0
  private A: number = 8
  private B: number = 11
  private C: number = 12
  private D: number = 13
  private MAX_POSITION: number = 100

  private async ccw (): Promise<void> {
    const board = this.arduino.board

    board.digitalWrite(this.A, board.HIGH)
    board.digitalWrite(this.B, board.HIGH)
    board.digitalWrite(this.C, board.LOW)
    board.digitalWrite(this.D, board.LOW)
    await delay(this.speed)

    board.digitalWrite(this.A, board.LOW)
    board.digitalWrite(this.B, board.HIGH)
    board.digitalWrite(this.C, board.HIGH)
    board.digitalWrite(this.D, board.LOW)
    await delay(this.speed)

    board.digitalWrite(this.A, board.LOW)
    board.digitalWrite(this.B, board.LOW)
    board.digitalWrite(this.C, board.HIGH)
    board.digitalWrite(this.D, board.HIGH)
    await delay(this.speed)

    board.digitalWrite(this.A, board.HIGH)
    board.digitalWrite(this.B, board.LOW)
    board.digitalWrite(this.C, board.LOW)
    board.digitalWrite(this.D, board.HIGH)
    await delay(this.speed)

    this.position++
  }

  private async cw (): Promise<void> {
    const board = this.arduino.board

    board.digitalWrite(this.A, board.HIGH)
    board.digitalWrite(this.B, board.LOW)
    board.digitalWrite(this.C, board.LOW)
    board.digitalWrite(this.D, board.HIGH)
    await delay(this.speed)

    board.digitalWrite(this.A, board.LOW)
    board.digitalWrite(this.B, board.LOW)
    board.digitalWrite(this.C, board.HIGH)
    board.digitalWrite(this.D, board.HIGH)
    await delay(this.speed)

    board.digitalWrite(this.A, board.LOW)
    board.digitalWrite(this.B, board.HIGH)
    board.digitalWrite(this.C, board.HIGH)
    board.digitalWrite(this.D, board.LOW)
    await delay(this.speed)

    board.digitalWrite(this.A, board.HIGH)
    board.digitalWrite(this.B, board.HIGH)
    board.digitalWrite(this.C, board.LOW)
    board.digitalWrite(this.D, board.LOW)
    await delay(this.speed)

    this.position--
  }

  setSpeed (spd: number): void {
    this.speed = spd
  }

  async step (clockwise: boolean = false): Promise<void> {
    const board = this.arduino.board

    board.digitalWrite(9, board.HIGH)
    board.digitalWrite(10, board.HIGH)
    if (clockwise) {
      await this.cw()
    } else {
      await this.ccw()
    }
    console.log('new position:', this.position)
    board.digitalWrite(9, board.LOW)
    board.digitalWrite(10, board.LOW)
  }

  async reset (force: boolean = false): Promise<void> {
    let i = 0
    while (!this.reachedEdge() || (force && i++ < this.MAX_POSITION)) {
      await this.step(false)
    }
  }

  reachedEdge (): boolean {
    return this.position <= 0 || this.position >= this.MAX_POSITION
  }
}
