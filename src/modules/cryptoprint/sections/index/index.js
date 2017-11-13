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

import Hero from './parts/hero'

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
    return <div className='index-section'>
      <Hero></Hero>
    </div>
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
