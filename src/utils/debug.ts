import debug from 'debug'
import config from './config'

export type Debugger = (subprocess: string) => debug.Debugger

export default function (subprocess: string): debug.Debugger {
  return debug(`${config.name}:${subprocess}`)
}
