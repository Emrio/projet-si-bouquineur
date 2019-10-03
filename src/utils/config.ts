import { merge } from 'lodash'
export type LocalConfig = typeof import('../../assets/config.json')

export type BaseConfig = {
  env: string
  name: string
  version: string
}

export type Config = BaseConfig & LocalConfig

const config = (merge(require('../../../assets/config.json'), {
  env: process.env.NODE_ENV || 'developpement',
  name: require('../../../package.json').name,
  version: require('../../../package.json').version
})) as Config

export default config
