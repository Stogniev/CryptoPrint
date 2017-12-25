import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Paper from 'react-md/lib/Papers'
import LogoOnepager from '../../bits/onepager-logo'


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

class Header extends Component {

  render () {
    return (
      <header className='op-header'>
        <div className="container">
          <strong>
            <a href="#">
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