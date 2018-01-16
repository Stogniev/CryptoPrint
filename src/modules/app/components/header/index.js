import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'

import { firebaseConnect } from 'react-redux-firebase'

import Paper from 'react-md/lib/Papers'
// import { ToolbarGroup } from 'material-ui/Toolbar'
// import Button from 'react-md/lib/Buttons'

// import UserMenu from './user-menu'
import * as Scroll from 'react-scroll' // Imports all Mixins
import LogoOnepager from './../../../cryptoprint/bits/onepager-logo'
import Icon from './../../../cryptoprint/bits/girls-head'

import './header.css'

const scroller = Scroll.scroller
const scrollOptions = {
  delay: 100,
  smooth: true,
  offset: 50 // Scrolls to element + 50 pixels down the page
}

const scrollTo = name => e => {
  // let a = document.querySelector('.active-item')
  // a ? a.classList.remove('active-item') : null
  e.target.classList.add('active-item')

  return scroller.scrollTo(name, scrollOptions)
}

class AppHeader extends Component {
  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll)
  }

  handleScroll () {
    let header = document.querySelector('.header');
    (window.pageYOffset > 300) ? header.classList.add('gradient') : header.classList.remove('gradient')
  }

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
    // const { user, ui: { showMenu = false } } = this.props
    // const { loggedIn } = user || {}
    return (
      <Paper zDepth={0} className='header'>
        <div className='app-header container'>
          <div className='brand'>
            {/* <Button icon
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
            /> */}
            <strong className='logo'>
              <a href='/'>
                <LogoOnepager />
              </a>
            </strong>
            <strong className='logo-mobile'>
              <a href='/'>
                <Icon />
              </a>
            </strong>
          </div>
          <div className='content'>
            <div className='nav-btn' onClick={scrollTo('attributes')} ref='attributes' data-name='attributes'>About</div>
            <div className='nav-btn' onClick={scrollTo('features')} ref='features' data-name='features'>Features</div>
            <div className='nav-btn' onClick={scrollTo('preorder')} ref='preorder' data-name='preorder'>Buy now</div>
            <div className='nav-btn' onClick={scrollTo('team')} ref='team' data-name='team'>Team</div>
            <div className='nav-btn' onClick={scrollTo('community')} ref='community' data-name='community'>Community</div>
          </div>
          {/* <ToolbarGroup className='rights'>
            {false && loggedIn ? <UserMenu
              isAdmin={this.props.isAdmin}
              gmode={this.props.gmode}
              onSignout={this.onSignout.bind(this)}
              user={this.props.user} /> : null}
          </ToolbarGroup> */}
        </div>
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
