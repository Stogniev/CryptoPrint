import React, { Component } from 'react'
import { firebaseConnect } from 'react-redux-firebase'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'

import TextField from 'react-md/lib/TextFields'

export class PreorderSection extends Component {
  render () {
    return <div>
      <h2>Preorder Here</h2>
      <form>
        <section>
          <TextFieldWithFBError id='email' label='Email Address' onChange={(id) => (e, v) => console.log(id, 'changed', e, v)} />
        </section>
      </form>
    </div>
  }
}

export const TextFieldWithFBError = ({id, label, onChange, onBlur = () => {}, type = 'text', errorCode, errorMessage, errorCheck, tabIndex, ...props}) =>
  <TextField id={id} label={label} onChange={onChange(id)} onBlur={onBlur(id)}
    error={!!errorCode && !!errorCode.match(errorCheck)}
    errorText={errorMessage}
    type={type}
    tabIndex={tabIndex}
  />

const fbConnectedPreorder = firebaseConnect([
  'authErrors'
])(PreorderSection)

export default connect(
  ({ firebase: { auth, authError, profile } }) => ({
    auth, authError, profile
  })
)(fbConnectedPreorder)
