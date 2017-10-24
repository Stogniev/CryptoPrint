/**
 Adapted from https://github.com/pointbiz/bitaddress.org/blob/master/src/ninja.seeder.js
*/

import Crypto from 'safebit/crypto'
import SecureRandom from 'safebit/crypto/secure-random'

const getSeedLimit = (limit = 200) => limit + Math.floor(Crypto.util.randomBytes(12)[11])

export const Seeder = {
  seedLimit: getSeedLimit(),
  seedCount: 0,
  lastInputTime: new Date().getTime(),
  seedPoints: [],
  isStillSeeding: true,
  poolProgress: 0,
  pool: null,
  poolHex: null,

  init () {
    Object.assign(Seeder, {
      seedLimit: getSeedLimit(),
      seedCount: 0,
      lastInputTime: new Date().getTime(),
      seedPoints: [],
      isStillSeeding: true,
      poolProgress: 0,
      pool: null,
      poolHex: null
    })
  },

  seed (num) {
    if (!num) throw new Error('Seeder.seed requires a number')
    const timeStamp = new Date().getTime()

    if (Seeder.seedCount === Seeder.seedLimit) {
      // seeding is over now we generate and display the address
      Seeder.seedCount++
      Seeder.isStillSeeding = false
    } else if ((Seeder.seedCount < Seeder.seedLimit) && num && (timeStamp - Seeder.lastInputTime) > 40) {
      // seed mouse position X and Y when mouse movements are greater than 40ms apart.
      SecureRandom.seedTime()
      SecureRandom.seedInt16(num)
      Seeder.seedCount++
      Seeder.lastInputTime = new Date().getTime()
    }
    Seeder.updatePool()
  },

  updatePool () {
    Seeder.pool = SecureRandom.poolCopyOnInit || SecureRandom.pool
    Seeder.poolHex = Crypto.util.bytesToHex(Seeder.pool)
    Seeder.poolProgress = (Seeder.seedCount / Seeder.seedLimit)
  }
}

export default Seeder
