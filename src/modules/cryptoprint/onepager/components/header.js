import React, { Component } from 'react'
import { connect } from 'react-redux'

import LogoOnepager from '../../bits/onepager-logo'

import {firebaseConnect} from 'react-redux-firebase' // Imports all Mixins

class Header extends Component {
  render () {
    return (
      <header className='op-header'>
        <div className='container'>
          <strong>
            <a href='/'>
              <LogoOnepager />
            </a>
          </strong>
        </div>
      </header>
    )
  }
}
const fbConnectedAppHeader = firebaseConnect([
  'authErrors'
])(Header)


export default connect(
  ({ firebase: { auth, authError, profile } }) => ({
    auth,
    authError,
    profile,
    ui: { showMenu: false }
  })
)(fbConnectedAppHeader)