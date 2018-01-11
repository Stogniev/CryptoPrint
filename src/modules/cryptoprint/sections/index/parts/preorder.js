import React, { Component } from 'react'
import { firebaseConnect } from 'react-redux-firebase'

import { connect } from 'react-redux'
import { compose } from 'redux'

import TextField from 'react-md/lib/TextFields'
import Card from 'react-md/lib/Cards'
import { Button } from 'react-md'

export class PreorderSection extends Component {
  constructor () {
    super()

    this.state = {
      fields: {
        amount: 3
      },
      error: ''
    }
  }

  handleInputChange (id, value) {
    const { state } = this
    const fields = {
      ...this.state.fields,
      [id]: value
    }
    let error = this.validate(id, value)
    let canSubmit = false
    const requiredFields = 'amount, email, name'
    const missingFields = requiredFields.split(', ').filter(e => !fields[e])

    if (!error && missingFields.length > 0) {
      error = `${missingFields[0]}:missing`
    } else if (!error && !missingFields.length) {
      canSubmit = true
    }

    if (!error && state.error && state.error.split(':')[0] === id) {
      error = false
    } else if (!error && state.error && state.error.split(':')[0] !== id) {
      error = state.error
    } else if (error && !state.error) {
        // noop
    }

    this.setState({fields, error, canSubmit})
  }

  validate (id, value) {
    if (id === 'email') {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(value) ? '' : 'email:format'
    } else if (id === 'amount') {
      const re = /^\d+$/
      return re.test(value) && value > 0 ? '' : 'amount:number'
    } else if (id === 'name') {
      const re = /^[\w\s]+$/
      return re.test(value) ? '' : 'name:must'
    } else return ''
  }

  submitPreorder (e) {
    e.preventDefault()
    const { canSubmit } = this.state

    if (!canSubmit) {
      return false
    }

    const { ref } = this.props.firebase
    const data = {
      order: this.state.fields,
      timestamp: Date.now()
    }
    // send email
    this.setState({ doing: true }, () => {
      ref('orders').child('incoming').push({data})
        .then(e => {
          this.setState({ done: true, doing: false })
        })
    })
  }

  render () {
    if (this.state.done) {
      return <section className='preorder'>
        <h3 className='title invert'>Preorder Form</h3>
        <h4>Your order has been submitted</h4>
        Add a comment to this line
        <p className='form-send'>Thank you for preordering Cryptoprint - we will get in touch with you soon to finalize your order.</p>
      </section>
    }
    return <section className='preorder' id='preorder'>
      <h3 className='title invert'>Buy now</h3>
      <form submit='#' className='preorder-form' onSubmit={this.submitPreorder.bind(this)}>
        <article>
          <TextFieldWithFBError id='name' label='Full Name' onBlur={(id) => (v, e) => this.handleInputChange(id, v.target.value)} errorMessage='Name is required' errorCode={this.state.error} errorCheck={'name:'} />
          <TextFieldWithFBError errorMessage='Email is badly formatted' errorCode={this.state.error} errorCheck={'email:'} id='email' label='Email Address'
            onBlur={(id) => (v, e) => this.handleInputChange(id, v.target.value)} />
          <TextFieldWithFBError id='amount' errorMessage='Amount must be a number greater than 1' errorCode={this.state.error} errorCheck={'amount:'} label='Amount of Bills' onBlur={(id) => (v, e) => this.handleInputChange(id, v.target.value)} />
        </article>
        <article className='actions'>
          <Button type='submit' className='circle-btn' disabled={!!this.state.error}><span>Buy now</span></Button>
        </article>
      </form>
    </section>
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

export default compose(
  firebaseConnect([
    { path: '/samples' }
  ]),
  connect(
    ({ firebase: { profile, data: { samples } } }) => ({
      samples: samples,
      profile
    })
  )
)(PreorderSection)
