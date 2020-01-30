import Firmata from 'firmata'

export const board = (port: string) => new Firmata(port)

// export function digitalWrite (pin: number, value: Firmata.PIN_STATE): void {
//   return board.digitalWrite(pin, value)
// }

export function delay (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
