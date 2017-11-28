import React, { Component } from 'react'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'

import TextField from 'react-md/lib/TextFields'
import Card from 'react-md/lib/Cards'
import { Autocomplete, SelectionControlGroup, SelectField, Button } from 'react-md'
import currencies from 'services/currencies'

const acCurrencies = currencies.map(({symbol, name}) => ({symbol, name, primaryText: name}))

console.log('acCurrencies:', acCurrencies)

const walletTypes = [
  {label: 'Normal', value: 'Norm'},
  {label: 'Multisig', value: 'Multi'},
  {label: 'Shares', value: 'Shares'},
  {label: 'Segwit', value: 'Segwit'}
]

export class PreorderSection extends Component {
  constructor () {
    super()

    this.state = {
      currency: '',
      fields: {
        amount: 3
      },
      error: ''
    }
  }

  handleSearchCurrency (value) {
    if (value) {
      if (this.state.username) {
        this.setState({ username: '' })
      }
    } else {
      // this.props.clearSearchResults()
    }
  }

  handleInputChange (id, value) {
    const fields = {
      ...this.state.fields,
      [id]: value
    }

    let error = this.validate(id, value)
    let canSubmit = false
    const requiredFields = 'amount, email, wallet_type, currency, name'
    const missingFields = requiredFields.split(', ').filter(e => !fields[e])

    if (!error && missingFields.length > 0) {
      error = `${missingFields[0]}:missing`
    } else {
      canSubmit = true
    }

    this.setState({fields, error, canSubmit}, e => {
      console.log('this state now:', this.state)
    })
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
    console.log('fb:', this.props.firebase)
    const { canSubmit } = this.state

    if (!canSubmit) {
      return false
    }
    this.setState({submitting: true}, () => {
      const data = {
        order: this.state.fields,
        timestamp: Date.now()
      }
      console.log('data to push:', data)
      const push = this.props.firebase.push('orders/incoming', {})
      push.then(ref => {
        const { key } = ref
        console.log('pushed?', ref)
        this.props.firebase.set(`orders/incoming/${key}`, Object.assign(data, { orderId: key }))
        .then(ref => {
          console.log('ref of order:', ref)
          this.setState({
            submitting: false,
            done: true
          })
        })
      })
      // this.props.firebase.set('order/incoming/' + Math.floor(Math.random() * 9000), )
      console.log('submitted')
    })
  }

  render () {
    const { samples, profile } = this.props

    if (isLoaded(samples)) {
      console.log('samples loaded:', samples)
    } else {
      console.log('samples not loaded yet...', samples)
    }

    if (isLoaded(profile)) {
      console.log('profile loaded:', profile)
    } else {
      console.log('profile not loaded yet...')
    }

    console.log('firebase:', this.props.firebase)
    if (this.state.done) {
      return <section className='preorder'>
        <Card>
          <h2>Preorder Form</h2>
          <article>
            <h3>Your order has been submitted</h3>
            <p>Thank you for preordering Cryptoprint - we will get in touch with you soon to finalize your order.</p>
          </article>
        </Card>
      </section>
    }
    return <section className='preorder'>
      <Card>
        <h2>Preorder Form</h2>
        <form submit='#' onSubmit={this.submitPreorder.bind(this)}>
          <article>
            <legend>Your Details</legend>
            <TextFieldWithFBError errorMessage='Email is badly formatted' errorCode={this.state.error} errorCheck={'email:'} id='email' label='Email Address'
              onBlur={(id) => (v, e) => this.handleInputChange(id, v.target.value)} />
            <TextFieldWithFBError id='name' label='Full Name' onBlur={(id) => (v, e) => this.handleInputChange(id, v.target.value)} errorMessage='Name is required' errorCode={this.state.error} errorCheck={'name:'} />
          </article>
          <article>
            <legend>Your Order</legend>
            <Autocomplete
              id='currency'
              label='Select Cryptocurrency'
              ref='currency'
              placeholder={acCurrencies[0].name}
              required
              data={acCurrencies}
              onBlur={(v, e) => this.handleInputChange('currency', this.refs.currency.value)}
              className='md-cell md-cell--6 md-cell--4-phone'
              errorText='Currency is required!'
            />
            <SelectField
              id='select-field-1'
              label='Wallet Type'
              className='md-cell'
              defaultValue={walletTypes[0].value}
              onChange={(v, e) => this.handleInputChange('wallet_type', v)}
              menuItems={walletTypes}
            />
            <TextFieldWithFBError id='amount' errorMessage='Amount must be a number greater than 1' errorCode={this.state.error} errorCheck={'amount:'} label='Amount' defaultValue={3} onBlur={(id) => (v, e) => this.handleInputChange(id, v.target.value)} />
          </article>
          <article className='actions'>
            <Button type='submit' flat label='Submit' disabled={!!this.state.error} />
          </article>
        </form>
      </Card>
    </section>
  }
}

export const TextFieldWithFBError = ({id, defaultValue, label, onChange = () => {}, onBlur = () => {}, type = 'text', errorCode, errorMessage, errorCheck, tabIndex, ...props}) =>
  <TextField id={id} label={label} onChange={onChange(id)} onBlur={onBlur(id)}
    error={(!!errorCode && !!errorCode.match(errorCheck)) || (console.log('errorCode, errorCheck:', errorCode, errorCheck))}
    errorText={errorMessage}
    defaultValue={defaultValue}
    type={type}
    tabIndex={tabIndex}
  />

// const fbConnectedPreorder = firebaseConnect([
//   ['samples/']
// ])(PreorderSection)

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
