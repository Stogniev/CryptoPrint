import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import { Link, browserHistory } from 'react-router'

import Avatar from 'react-md/lib/Avatars'
import Button from 'react-md/lib/Buttons/Button'

import SocialPerson from 'material-ui/svg-icons/social/person'

import GoogleG from 'cryptoprint/bits/custom-icons/google-g'

import { PendingSection, TextFieldWithFBError } from '../'

import './login.css'

class SectionLogin extends Component {
  constructor () {
    super()

    this.state = {
      canLogin: false,
      pending: false
    }
    this.values = {}
  }

  inputChange (id) {
    return (value, event) => {
      if (id === 'email') {
        // check if valid email
        this.has_email = !!value
      } else if (id === 'password') {
        this.has_password = !!value
      }
      this.values[id] = value

      const hasAll = this.has_email && this.has_password

      if (hasAll !== this.state.canLogin) {
        this.setState({canLogin: hasAll})
      }
    }
  }

  signIn () {
    const { email, password } = this.values
    this.setState({pending: true})
    this.doSignin({email, password})
      .then(({success, result, error}) => {
        console.log('then of signIn:', result)
        browserHistory.push('/home')
      })
  }

  signinWithGoogle () {
    this.doSignin({
      provider: 'google',
      type: 'popup'
    })
    .then(({success, result, error}) => {
      console.log('then of signinWithGoogle!', result)
      browserHistory.push('/home')
    })
  }

  doSignin (credentials) {
    const success = true
    this.setState({pending: true})

    return this.props.firebase.login(credentials)
      .then(result => {
        this.setState({pending: false})
        return {success, result}
      })

      .catch(authError => {
        this.setState({ pending: false })
        return {success: false, authError}
      })
  }

  render () {
    const { pending, canLogin } = this.state
    const { authError } = this.props
    const { authError: stateAuthError } = this.state
    const { code, message } = stateAuthError || authError || {}
    let tabIndex = 0

    return <PendingSection pending={pending} className='login'>
      <div className='user-avatar'>
        <Avatar onClick={e => this.setState({pending: !pending})} icon={<SocialPerson className='none' style={{width: 102, height: 102}} />} />
        {/* <Avatar icon={<SocialPerson className='none' style={{width: 102, height: 102}} />} /> */}
      </div>

      <h1>Sign in</h1>
      <form className='sign-in'>
        <TextFieldWithFBError
          tabIndex={++tabIndex}
          submit={e => this.registerMe()}
          keyDown={e => console.log('key down!')}
          errorCode={code} errorMessage={message} errorCheck={/email|user-not-found/}
          id='email' label='Email' onChange={this.inputChange.bind(this)}
        />
        <TextFieldWithFBError
          tabIndex={++tabIndex}
          submit={e => this.registerMe()}
          errorCode={code} errorMessage={message} errorCheck={/password/}
          id='password' type='password' label='Password' onChange={this.inputChange.bind(this)}
        />

        <div className='actions'>
          <Button onClick={e => this.signIn()} raised primary disabled={!canLogin}>LOGIN</Button>
          <Button flat component={Link} to='/signin/signup'>Create a new Account</Button>
        </div>
        <div className='extra-actions'>
          <Button raised onClick={e => this.signinWithGoogle()}><GoogleG style={{width: 16, height: 16}} /> Sign in with Google</Button>
        </div>
      </form>
    </PendingSection>
    // this.props.firebase contains API
  }
}

const fbConnectedLogin = firebaseConnect([
  'authErrors'
])(SectionLogin)

export default connect(
  ({ firebase: { auth, authError, profile } }) => ({
    auth, authError, profile
  })
)(fbConnectedLogin)
