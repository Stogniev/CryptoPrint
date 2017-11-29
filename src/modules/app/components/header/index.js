import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { firebaseConnect } from 'react-redux-firebase'

import Paper from 'react-md/lib/Papers'
import AlertError from 'material-ui/svg-icons/alert/error'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import Button from 'react-md/lib/Buttons'
import { SocialIcon } from 'react-social-icons';

import CryptoprintIcon from 'cryptoprint/bits/cryptoprint-icon'
import GirlsHead from 'cryptoprint/bits/girls-head'

import UserMenu from './user-menu'

import './header.css'

// const headerBackground = 'rgba(52, 84, 209, 1)'

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
          style={{
            // background: headerBackground,
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
              <GirlsHead className='cryptoprint-icon' />
            </Button>
          </ToolbarGroup>
          <ToolbarGroup className='content'>
            <Button flat secondary>About</Button>
            <Button flat>Team</Button>
            <Button flat>Preorder</Button>
            <SocialIcon network="facebook" style={{ height: 25, width: 25, margin: 10}} />
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
