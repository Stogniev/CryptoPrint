import React, { Component } from 'react'
import { connect } from 'react-redux'

import {firebaseConnect} from "react-redux-firebase" // Imports all Mixins


class Footer extends Component {

  render () {
    return (
      <footer className='op-footer'>
        <div className="container flex-container">
          <strong>
            <a href="/">
              <img src="./images/onepager/logo.png" alt="Crypto Print logo"/>
            </a>
          </strong>
          <div className="contacts flex-container">
            <span>Contact Details</span>
            <span>Contact Details</span>
            <span>Contact Details</span>
          </div>
        </div>
      </footer>
    )
  }
}
const fbConnectedAppHeader = firebaseConnect([
  'authErrors'
])(Footer)


export default connect(
  ({ firebase: { auth, authError, profile } }) => ({
    auth,
    authError,
    profile,
    ui: { showMenu: false }
  })
)(fbConnectedAppHeader)