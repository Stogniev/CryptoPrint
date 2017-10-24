import React, { Component } from 'react'
import { firebaseConnect } from 'react-redux-firebase'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'

import Avatar from 'react-md/lib/Avatars'
import Button from 'react-md/lib/Buttons/Button'

import SocialPerson from 'material-ui/svg-icons/social/person'

import GoogleG from 'safebit/bits/custom-icons/google-g'

import { newUserProfile } from 'app/user'

import { PendingSection, TextFieldWithFBError } from '../'

import './signup.css'

class SectionSignup extends Component {
  constructor () {
    super()

    this.state = {
      canRegister: false,
      pending: false
    }
    this.values = {}
  }
  registerMe () {
    const { pending } = this.state
    const { email, password } = this.values

    if (pending) return

    const createUser = this.props.firebase.createUser(
      {
        email,
        password
      },
      {
        username: `temp-user-${Math.floor(Math.random() * 1000)}`,
        email,
        type: 'tester'
      })

    this.setState({pending: true})

    createUser
      .then(newUserProfile)
      .then(r => {
        console.log('user created:', r)
        browserHistory.push('/home')
      })
    .catch(error => {
      console.log('error from createUser', error)
      this.setState({pending: false})
    })
    // this.props.firebase.login({
    //   provider: 'google',
    //   type: 'popup'
    // })
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

  inputChange (id) {
    return (value, event) => {
      if (id === 'email') {
        // check if valid email
        this.has_email = !!value
      } else if (id === 'password') {
        this.has_password = !!value
        this.has_password_repeat = this.values['password-repeat'] === value
      } else if (id === 'password-repeat') {
        if (value && this.has_password) {
          if (this.values['password'] === value) {
            this.has_password_repeat = true
          } else {
            this.has_password_repeat = false
          }
        }
      }
      this.values[id] = value

      const hasAll = this.has_email && this.has_password && this.has_password_repeat

      if (hasAll !== this.state.canRegister) {
        this.setState({canRegister: hasAll})
      }
    }
  }

  render () {
    console.log('state:', this.state)
    console.log('props:', this.props)
    const { pending } = this.state
    const { authError } = this.props
    const { authError: stateAuthError } = this.state
    const { code, message } = stateAuthError || authError || {}

    let tabIndex = 0

    return <PendingSection pending={pending} className='signup'>
      <div className='user-avatar'>
        <Avatar onClick={e => this.setState({pending: !pending})} icon={<SocialPerson className='none' style={{width: 102, height: 102}} />} />
      </div>

      <h1>Sign Up</h1>
      <form className='sign-in' onSubmit={e => console.log('wlela?', e)}>
        <TextFieldWithFBError
          tabIndex={++tabIndex}
          submit={e => this.registerMe()}
          keyDown={e => console.log('key down!')}
          errorCode={code} errorMessage={message} errorCheck={/email/}
          id='email' label='Email' onChange={this.inputChange.bind(this)}
        />
        <TextFieldWithFBError
          tabIndex={++tabIndex}
          submit={e => this.registerMe()}
          errorCode={code} errorMessage={message} errorCheck={/password/}
          id='password' type='password' label='Password' onChange={this.inputChange.bind(this)}
        />
        <TextFieldWithFBError
          tabIndex={++tabIndex}
          submit={e => this.registerMe()}
          id='password-repeat' type='password' label='Repeat Password' onChange={this.inputChange.bind(this)}
        />

        <div className='actions'>
          <Button raised primary
            tabIndex={++tabIndex}
            onClick={e => this.registerMe()}
            disabled={!this.state.canRegister}
          >Create Account</Button>
          <Button flat component={Link} to='/signin'>Cancel</Button>
        </div>
        <div className='extra-actions '>
          <Button raised tabIndex={++tabIndex} onClick={e => this.registerMeWithGoogle()}><GoogleG style={{width: 16, height: 16}} /> Sign in with Google</Button>
        </div>
      </form>
    </PendingSection>
        // this.props.firebase contains API
  }
}

const fbConnectedSignup = firebaseConnect([
  'authErrors'
])(SectionSignup)

export default connect(
  ({ firebase: { auth, authError, profile } }) => ({
    auth, authError, profile
  })
)(fbConnectedSignup)
