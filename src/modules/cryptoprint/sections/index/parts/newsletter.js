import React, { Component } from 'react'

import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import TextField from 'react-md/lib/TextFields'
import { Button } from 'react-md'

export class Newsletter extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      emailValid: false,
      inputPlaceholder: 'Enter your email to receive updates'
    }
    this.validateEmail = this.validateEmail.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  validateEmail (e) {
    let regxrTest = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let mailString = e.target.value
    if (regxrTest.test(mailString)) {
      this.setState({ emailValid: true, email: mailString })
    } else {
      this.setState({ emailValid: false, email: mailString })
    }
  }
  handleSubmit (e) {
    e.preventDefault()
    if (this.state.emailValid === true) {
      const { ref } = this.props.firebase
      const { email } = this.state
      // send email
      this.setState({ doing: true }, () => {
        ref('newsletter').child('unverified').push({email})
          .then(e => {
            console.log('222')
            this.setState({ done: true, doing: false })
          })
      })
    } else {
      this.setState({ error: 'email:format' })
    }
  }
  render () {
    if (this.state.done) {
      return <section className='newsletter'>
        <h3>Thank you!</h3>
      </section>
    }
    return (
      <section className='newsletter' id='newsletter'>
        <p>Sing up for our newsletter</p>
        <div className='form-container'>
          <TextFieldWithFBError id='email' label='Email' onBlur={(id) => (v, e) => this.validateEmail(v)} errorMessage='Email is Required' errorCode={this.state.error} errorCheck={'email:'} />

          <Button onClick={this.handleSubmit} className='sub-btn circle-btn'><span>Subscribe</span></Button>
        </div>
      </section>
    )
  }
}

export const TextFieldWithFBError = ({id, defaultValue, label, onChange = () => {}, onBlur = () => {}, type = 'text', errorCode, errorMessage, errorCheck, tabIndex, ...props}) =>
  <TextField id={id} label={label} onChange={onChange(id)} onBlur={onBlur(id)}
    error={(!!errorCode && !!errorCode.match(errorCheck))}
    errorText={errorMessage}
    defaultValue={defaultValue}
    type={type}
    tabIndex={tabIndex}
  />

const NewsletterFB = firebaseConnect([
])(Newsletter)

export default connect(
)(NewsletterFB)
