import React, { Component } from 'react'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'

import TextField from 'react-md/lib/TextFields'
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
      fields: {},
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

    const error = this.validate(id, value)

    this.setState({fields, error}, e => {
      console.log('this state now:', this.state)
    })
  }

  validate (id, value) {
    if (id === 'email') {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(value) ? '' : 'email:format'
    } else return ''
  }

  submitPreorder (e) {
    e.preventDefault()
    this.props.firebase.set('samples/' + Math.floor(Math.random() * 9000), { order: this.state.fields, userId: this.props.profile.uid })
    console.log('submitted')
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
    return <section className='preorder'>
      <h2>Preorder Here</h2>
      <Button raised label='load?' onClick={e => this.props.firebase.watchEvent('value', 'samples')} />
      <form submit='#' onSubmit={this.submitPreorder.bind(this)}>
        <article>
          <legend>Your Details</legend>
          <TextFieldWithFBError errorMessage='Email is badly formatted' errorCode={this.state.error} errorCheck={'email:'} id='email' label='Email Address' onChange={(id) => (v, e) => this.handleInputChange(id, v)} />
          <TextFieldWithFBError id='name' label='Full Name' onChange={(id) => (v, e) => this.handleInputChange(id, v)} />
        </article>
        <article>
          <legend>Your Order</legend>
          <Autocomplete
            id='currency'
            label='Select Cryptocurrency'
            placeholder={acCurrencies[0].name}
            required
            data={acCurrencies}
            onChange={(v, e) => this.handleInputChange('currency', v)}
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
        </article>
        <article className='actions'>
          <Button type='submit' flat label='Submit' />
        </article>
      </form>
    </section>
  }
}

export const TextFieldWithFBError = ({id, label, onChange, onBlur = () => {}, type = 'text', errorCode, errorMessage, errorCheck, tabIndex, ...props}) =>
  <TextField id={id} label={label} onChange={onChange(id)} onBlur={onBlur(id)}
    error={(!!errorCode && !!errorCode.match(errorCheck)) || (console.log('errorCode, errorCheck:', errorCode, errorCheck))}
    errorText={errorMessage}
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
