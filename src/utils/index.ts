import * as config from './config'
import * as debug from './debug'
import random from './random'

export interface Utils {
  config: config.Config
  debug: debug.Debugger
  random: (randomRandom?: boolean) => string
}

const modules: Utils = {
  config: config.default,
  debug: debug.default,
  random: random
}

export default modules
