import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Paper from 'react-md/lib/Papers'


import * as Scroll from 'react-scroll'
import {firebaseConnect} from "react-redux-firebase" // Imports all Mixins


const scroller = Scroll.scroller
const scrollOptions = {
  delay: 100,
  smooth: true,
  offset: 50 // Scrolls to element + 50 pixels down the page
}
const scrollTo = name => e => scroller.scrollTo(name, scrollOptions)
const headerBackground = 'rgba(22, 22, 22, 0.987)'

class Footer extends Component {

  render () {
    return (
      <footer className='op-footer'>
        <div className="container flex-container">
          <strong>
            <a href="#">
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