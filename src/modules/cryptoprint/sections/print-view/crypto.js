import bitcore from 'bitcore-lib'

var random = require('get-random-values');


export function shuffle (arr) {
  arr = arr.slice(0) // dont modify source arr
  const randomBuffer = new Uint8Array(arr.length) // short arrays only. less than 3000 in length, actually less than 255 in length as beccaus uint8
  random(randomBuffer)
  let ret = []
  let randi = 0
  while (arr.length) {
    ret.push(arr.splice(randomBuffer[randi++] % arr.length, 1)[0])
  }
  return ret
}

// the code tries to prevent frequency analysis
// by making even filed possible or by adding randomness on top of it

// the first char is version, to not throw away bits if all leters before are not L or K, i just put the first letter as is

// keys with too much repeating same letter are not too good for this. so they are rejected.

// var privKey="L5GsZnm9zguD92jeXxHJCqsojuQF45HM8N91A5JLkt5JpS6Hu9AG"
// console.log(getEvenFrequencyPad(privKey,144,1))

export function getEvenFrequencyPad (privKey, toNChars, sealLayers = 1) {
  const base58c = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  let charsArr = privKey.split('')
  let o = charsArr.shift()
  let has = base58c.split('').map(() => 0)
  let len = charsArr.length
  let i

  var n = toNChars
  var charstoadd = ''

  const randomBuffer = new Uint8Array(n) // short arrays only. less than 3000 in length, actually less than 255 in length as beccaus uint8
  random(randomBuffer)

  // seal
  for (var j = 0; j < sealLayers; j++) {
    for (i = 0; i < base58c.length && len < n; i++) {
      if (has[i] < 2) {
        has[i]++
        len++
        charstoadd += base58c[i]
      }
    }
  }

  // sparkle some randomness
  for (i = len; i < n; i++) {
    var rand = base58c[randomBuffer[i] % base58c.length]
    has[base58c.indexOf(rand)]++
    charstoadd += rand
    len++
  }

  var charsToAddArr = charsArr.map(() => '_').concat(charstoadd.split(''))

  var pad = (shuffle(charsToAddArr).join(''))
  o += pad.replace(/_/g, () => charsArr.shift())

  pad = ('_' + pad).split('').map(a => a === '_' ? ' ' : '\u2588').join('')

  return { padded: o, marking: pad }
}

//const tt = i => Math.floor(Math.random() * Math.pow(10, 10)) * i
//const s1 = x => (tt(tt(tt(42)))).toString(32).split('').sort((a, b) => Math.random() > 0.5 ? -1 : 1).join('')
//const getSeed = x => s1() + s1() + s1()

export function getBitcoinKeypair() {
	// const seed = getSeed()
    var privateKey = new bitcore.PrivateKey()
    var publicKey = privateKey.publicKey
    //var address = publicKey.toAddress()
    //console.log(address.toString(), privateKey.toWIF(), 'running generate...')
    return {publicKey:publicKey.toAddress().toString(), privateKey: privateKey.toWIF()}
}