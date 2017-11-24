import React, { Component } from 'react'

import bitcoin from 'bitcoinjs-lib'
import bigi from 'bigi'

import { Button } from 'react-md'
import generate from './raws'
import { generatePrivateQRA } from './raws'

const tt = i => Math.floor(Math.random() * Math.pow(10, 10)) * i
const s1 = x => (tt(tt(tt(42)))).toString(32).split('').sort((a, b) => Math.random() > 0.5 ? -1 : 1).join('')
const getSeed = x => s1() + s1() + s1()

export class PrintViewSection extends Component {
  doGenerate () {
    const seed = getSeed()
    var hash = bitcoin.crypto.sha256(seed)
    var d = bigi.fromBuffer(hash)

    var keyPair = new bitcoin.ECPair(d)
    var pubKey = keyPair.getAddress()
    const privKey = keyPair.toWIF()
    console.log('keyPair', keyPair)
    console.log(seed, hash, pubKey, 'running generate...')
    generate(pubKey, privKey)
    console.log('done')
  }
  render () {
    return <div>
      <h2>Welcome to PrintView PRV</h2>
      <Button raised onClick={e => this.doGenerate()} label='Generate' />
      <div id='page_back_on_transparent_data' />
      <div id='page_front_data' />

    </div>
  }
}

export default PrintViewSection
