import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import { List, ListItem } from 'react-md/lib/Lists'
import Subheader from 'react-md/lib/Subheaders'

import Page from 'app/components/page'

// SVG icon from material ui
import ActionHome from 'material-ui/svg-icons/action/home'
import ActionGrade from 'material-ui/svg-icons/action/grade'

// Button
import Button from 'react-md/lib/Buttons'

import './index.css'

class SectionIndex extends Component {
  constructor () {
    super()

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

  render () {
    // console.log('this.props:', this.props)
    return <Page>
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
      <section><div>Welcome to Cryptoprint! <div onClick={e => this.registerMe()}>Click Me!</div></div></section>
      <aside>

        <Button raised primary onClick={e => this.encrypt()}>Encrypt</Button>
        <Button raised secondary onClick={e => this.decrypt()}>Decrypt</Button>
      </aside>
      <section>
        <legend>Your wallets</legend>
        <p>You have 0 wallets</p>
      </section>
      <aside>
        <Button raised primary>Create New Wallet</Button>
      </aside>

      <section>
        <div>
          <Button raised primary>Reset Seeder</Button>
        </div>
        <div className='scratchy'>
          Scratch here
        </div>
      </section>
      <section>A</section>
      <aside>B</aside>

    </Page>
  }
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
