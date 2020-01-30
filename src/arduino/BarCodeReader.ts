import { Arduino } from '.'

export class BarCodeReader {
  constructor (private arduino: Arduino) {}

  async getCode (): Promise<string> {
    // TODO: Write function
    return ''
  }
}
