import React, { Component } from 'react'
import { firebaseConnect } from 'react-redux-firebase'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'

import Avatar from 'react-md/lib/Avatars'
import Button from 'react-md/lib/Buttons/Button'

import SocialPerson from 'material-ui/svg-icons/social/person'

import GoogleG from 'cryptoprint/bits/custom-icons/google-g'

import { newUserProfile } from 'app/user'


export class SigninSection extends Component {
  constructor () {
    super()

    this.state = {
      canRegister: false,
      pending: false
    }
    this.values = {}
  }
  registerMeWithGoogle () {
    this.setState({
      pending: true
    })
    this.props.firebase.login({
      provider: 'google',
      type: 'popup'
    })
    .then(newUserProfile)
    .then(u => {
      console.log('what is user?', u)
    })
  }
  render () {
    return <div>
      <h1>Hello, SigninSection</h1>
      <Button flat onClick={e => this.registerMeWithGoogle()}><GoogleG style={{width: 16, height: 16}} /> Sign in with Google</Button>
    </div>
  }
}

const fbConnectedSignin = firebaseConnect([
  'authErrors'
])(SigninSection)

export default connect(
  ({ firebase: { auth, authError, profile } }) => ({
    auth, authError, profile
  })
)(fbConnectedSignin)
