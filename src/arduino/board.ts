import Firmata from 'firmata'

export const board = (port: string) => new Firmata(port)

export type SERIAL_PORT_ID = Firmata.SERIAL_PORT_ID

export function delay (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
