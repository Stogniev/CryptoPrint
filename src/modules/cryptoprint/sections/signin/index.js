import React, { Component } from 'react'
import { firebaseConnect } from 'react-redux-firebase'

import TextField from 'react-md/lib/TextFields'

import Symbol from 'cryptoprint/bits/cryptoprint-icon'

import './signin.css'

class SectionLogin extends Component {
  registerMe () {
    this.props.firebase.login({
      provider: 'google',
      type: 'popup'
    })
  }

  render () {
    const { children } = this.props

    return <div className='soon'>
      <Symbol />
    </div>

    return <div className='signin'>
      <div className='wrap'>
        <div className='content'>
          <aside>
            <header><Symbol className='brand' /></header>
            <div className='texts'>
              <h1>Welcome to Cryptoprint</h1>
              <h4>Cryptoprint is a secured bitcoin multi-crypto wallet.</h4>

            </div>
          </aside>
          {children}
        </div>
      </div>
    </div>
    // this.props.firebase contains API
  }
}

export const PendingSection = ({pending, className, ...props}) => <section className={[className, pending ? 'pending' : ''].join(' ')} {...props} />

export const TextFieldWithFBError = ({id, label, onChange, onBlur = () => {}, type = 'text', errorCode, errorMessage, errorCheck, tabIndex, ...props}) =>
  <TextField id={id} label={label} onChange={onChange(id)} onBlur={onBlur(id)}
    error={!!errorCode && !!errorCode.match(errorCheck)}
    errorText={errorMessage}
    type={type}
    tabIndex={tabIndex}
  />
export default firebaseConnect()(SectionLogin)
