import crypto from 'crypto'

export default function (randomRandom: boolean = false): string {
  return crypto.randomBytes(randomRandom ? parseInt(crypto.randomBytes(1).toString('hex'), 16) + 128 : 256).toString('hex')
}
