import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { firebaseConnect } from 'react-redux-firebase'

import Paper from 'react-md/lib/Papers'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import Button from 'react-md/lib/Buttons'

// import GirlsHead from 'cryptoprint/bits/girls-head'

import UserMenu from './user-menu'
import * as Scroll from 'react-scroll' // Imports all Mixins

import './header.css'

const scroller = Scroll.scroller
const scrollOptions = {
  delay: 100,
  smooth: true,
  offset: 50 // Scrolls to element + 50 pixels down the page
}
const scrollTo = name => e => scroller.scrollTo(name, scrollOptions)
const headerBackground = 'transparent'

class AppHeader extends Component {
  onSignout (event) {
    event.preventDefault()
  }
  toggleMenu () {
    // const { uiActions } = this.props
    //
    // uiActions.toggleMenu()
    console.log('toggle!')
  }
  render () {
    const { user, ui: { showMenu = false } } = this.props
    const { loggedIn } = user || {}
    return (
      <Paper zDepth={0} className='header'>
        <Toolbar
          themed
          style={{
            background: headerBackground,
            minHeight: '60px',
            ...this.props.style
          }}

          className='app-header'
        >
          <ToolbarGroup firstChild className='brand' style={{marginLeft: -18}}>
            <Button icon
              onClick={e => this.toggleMenu()}
              className='menu'
              style={{padding: 3, margin: '10px'}}>
              {showMenu
                ? <NavigationClose color='#FFF' />
                : <NavigationMenu color='#FFF' />
              }
            </Button>
            <Button
              flat
              href='/'
              onClick={e => {
                e.preventDefault()
                browserHistory.push('/')
              }}
              className='cryptoprint'
            >
              {/* <GirlsHead className='cryptoprint-icon' /> */}
            </Button>
          </ToolbarGroup>
          <ToolbarGroup className='content'>
            <Button flat className='nav-btn' onClick={scrollTo('attributes')}>About</Button>
            <Button flat className='nav-btn' onClick={scrollTo('features')}>Features</Button>
            <Button flat className='nav-btn' onClick={scrollTo('team')}>Team</Button>
            <Button flat className='nav-btn' onClick={scrollTo('preorder')}>Pre-Order</Button>
            <Button flat className='nav-btn' onClick={scrollTo('community')}>Community</Button>
          </ToolbarGroup>
          <ToolbarGroup className='rights'>
            {false && loggedIn ? <UserMenu
              isAdmin={this.props.isAdmin}
              gmode={this.props.gmode}
              onSignout={this.onSignout.bind(this)}
              user={this.props.user} /> : null}
          </ToolbarGroup>

        </Toolbar>
      </Paper>
    )
  }
}

const fbConnectedAppHeader = firebaseConnect([
  'authErrors'
])(AppHeader)

export default connect(
  ({ firebase: { auth, authError, profile } }) => ({
    auth,
    authError,
    profile,
    ui: { showMenu: false }
  })
)(fbConnectedAppHeader)
