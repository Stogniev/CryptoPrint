import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import { List, ListItem } from 'react-md/lib/Lists'
import Subheader from 'react-md/lib/Subheaders'
import LinearProgress from 'react-md/lib/Progress/LinearProgress'
import Checkbox from 'react-md/lib/SelectionControls/Checkbox'

import Page from 'app/components/page'

// SVG icon from material ui
import ActionHome from 'material-ui/svg-icons/action/home'
import ActionGrade from 'material-ui/svg-icons/action/grade'
import AVMic from 'material-ui/svg-icons/av/mic'

// Button
import Button from 'react-md/lib/Buttons'

import Seeder from 'safebit/crypto/seeder'
import bitcoin from 'bitcoinjs-lib'
import bigi from 'bigi'

import aes from 'crypto-js/aes'
import { enc } from 'crypto-js'

import './index.css'

console.log('bitcoin.networks:', bitcoin.networks)

const generateKeypair = seed => {
  const network = bitcoin.networks.testnet
  const hash = bitcoin.crypto.sha256(seed)
  const d = bigi.fromBuffer(hash)
  // const rng = () => Buffer.from(seed, 'utf8')
  return bitcoin.ECPair(d, null, {network})
}

class SectionIndex extends Component {
  constructor () {
    super()

    Seeder.init()

    this.state = {
      progress: 0,
      seed: null
    }
  }
  registerMe () {
    this.props.firebase.login({
      provider: 'google',
      type: 'popup'
    })
  }

  mouseMoved (e) {
  }

  doneSeeding (seed) {
    console.log('Done seeding:', seed)
  }

  newWallet () {
    console.log('yea, create new wallet')
    console.log('props:', this.props)
    const { firebase } = this.props

    const keyPair = generateKeypair(this.state.seed)

    firebase.ref('test-addresses').child(keyPair.getAddress())
      .set({
        wif: keyPair.toWIF()
      })
  }

  setMicEntropy (allow) {
    if (allow) {
      console.log('allow entropy colelction via mic')
    } else {
      console.log('stop allowing mic usage')
    }
  }

  encrypt () {
    const encd = aes.encrypt('L5a74a48H6vtWs96jnJXi6B4NoKUzx3TRYAZKZvntNy7FEbRfAGb', '1NGSSubkCjDfqPNo8w4Pd4YeeGatvpqznP')

    console.log('encrypted:', encd.toString())
  }

  decrypt () {
    const decd = aes.decrypt('U2FsdGVkX181aV4yvNhhcl7Y+CjRVf+4hLNS7vb+Z0XToGdjI1LRxSBm4qUTdC7P5jKkltA/Rzpzq1NBWS0IFcj04xZ1ezTDQmSNbBfTEMU=', '1NGSSubkCjDfqPNo8w4Pd4YeeGatvpqznP')

    console.log('decyprted:', decd.toString(enc.UTF8))
  }

  render () {
    // console.log('this.props:', this.props)
    const { seed } = this.state
    let address

    if (seed && (!this.adddresses || this.addresses[this.addresses.length - 1].seed !== seed)) {
      // var keyPair = bitcoin.ECPair.makeRandom({ rng: rng })
      // var address = keyPair.getAddress()

      const keyPair = generateKeypair(seed)
      address = keyPair.getAddress()

      if (!this.addresses) {
        this.addresses = []
      }
      this.addresses.push({
        seed,
        address,
        keyPair
      })
    }

    const myAddresses = this.props.myAddresses
    const myAddArray = myAddresses && Object.keys(myAddresses).map(e => Object.assign({}, myAddresses[e], {address: e}))

    return <WithSeeder
      onReady={seed => this.doneSeeding(seed)}
      onUpdate={(seed, progress) => this.setState({seed, progress})}
      render={(seed, progress, resetSeed) => (<Page>
        <sidenav>

          <List className='page-sidenav'>
            <Subheader primaryText='Folders' />
            <ListItem
              leftAvatar={<ActionHome />}
              rightIcon={<ActionGrade />}
              primaryText='Wallets'
              secondaryText='Jan 9, 2014'
            />
          </List>

        </sidenav>
        <section><div>Welcome to Safebit! <div onClick={e => this.registerMe()}>Click Me!</div></div></section>
        <aside>That seed: {seed}</aside>
        <aside>

          <Button raised primary onClick={e => this.encrypt()}>Encrypt</Button>
          <Button raised secondary onClick={e => this.decrypt()}>Decrypt</Button>
        </aside>
        <section>
          <legend>Your wallets</legend>
          <p>You have 0 wallets</p>
        </section>
        <aside>
          <Button raised primary disabled={progress < 0.1} onClick={e => this.newWallet()}>Create New Wallet</Button>
          {progress < 1 && <p>Generate entropy for wallet by moving your mouse...</p>}
          {progress < 1 && <LinearProgress className={['pl', progress > 0.1 ? 'set' : ''].join(' ')} value={progress * 100} />}
        </aside>

        <section>
          <h2>Entropy Collector [{Math.round(progress * 100)}%]</h2>
          <h3>Pool: {seed}</h3>
          <h4>Address: <code>{address}{Seeder.isStillSeeding ? '!' : ''}</code></h4>
          <p>Total address: {this.addresses && this.addresses.length}</p>
          <div>
            <Button raised primary onClick={e => {
              this.addresses = []
              resetSeed()
            }}>Reset Seeder</Button>
          </div>
          <div className='scratchy'>
            Scratch here
          </div>
        </section>
        <section>A</section>
        <aside>B</aside>
        <Addresses addresses={myAddArray} />

      </Page>)} />
  }
}

class WithSeeder extends Component {
  constructor () {
    super()
    this.mouseMoveListener = e => this.mouseMoved(e)
  }
  mouseMoved (e) {
    if (Seeder.isStillSeeding) {
      const zore = n => n || Math.E
      // console.log('mouse moved :)', e.clientX, e.clientY)
      Seeder.seed((zore(e.clientX) * zore(e.clientY)))
      this.setState({progress: Seeder.poolProgress})

      if (Seeder.poolProgress >= 1) {
        this.props.onReady(Seeder.poolHex)
      } else {
        this.props.onUpdate(Seeder.poolHex, Seeder.poolProgress)
      }
    }
  }
  componentWillMount () {
    window.addEventListener('mousemove', this.mouseMoveListener)
  }
  componentWillUnmount () {
    window.removeEventListener('mousemove', this.mouseMoveListener)
  }

  resetSeed (e) {
    Seeder.init()
  }

  render () {
    const { poolProgress: progress, poolHex: seed } = Seeder
    return this.props.render(seed, progress, e => this.resetSeed(e))
  }
}

const Addresses = ({addresses, ...props}) => {
  if (!addresses || !addresses.length) return null
  let akey = 0
  return addresses.map((e) => ([
    <section key={`addresses-${++akey}`} onClick={evt => { e._active = !e._active }}><code>{e.address}</code><span>{e._active && '!'}</span></section>,
    e._active && <aside key={`wif-${++akey}`}><code>{e.wif}</code></aside>
  ]))
    .reduce((arr, e) => ([...e, ...arr]), [])
}

const fbConnectedIndex = firebaseConnect([
  'authErrors',
  '/test-addresses'
])(SectionIndex)

export default connect(
  ({ firebase: { auth, authError, profile, data } }) => ({
    auth, authError, profile, myAddresses: data['test-addresses']
  })
)(fbConnectedIndex)
