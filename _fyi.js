// Useful snippets

import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import Page from 'cryptoprint/components/page'

// SVG icon from material ui
import ActionHome from 'material-ui/svg-icons/action/home'

// Button
import Button from 'react-md/lib/Buttons'

export class ComponentXXXX extends Component {
  render () {
    const { router } = this.props
    const pageRoutes = [
      {label: 'Main', route: '/route/main'},
      {label: 'Create', route: '/route/main/create'}
    ]

    return <Page className='asset-management' router={router}>
      <page-title>Page title</page-title>
      <page-actions><Button raised primary icon={<ActionHome />} label='test' /></page-actions>
      <page-tabs>
        {pageRoutes}
      </page-tabs>
      <page-content>
        <h3>Content be here</h3>
        <support>
          <Link to='/support/link'>Support Link</Link>
        </support>

      </page-content>

    </Page>
  }
}

const fbConnectedXXXX = firebaseConnect([
  'authErrors'
])(ComponentXXXX)

export default connect(
  ({ firebase: { auth, authError, profile } }) => ({
    auth, authError, profile
  })
)(fbConnectedXXXX)

/*
  Useful Documentation

  React Redux Firebase
  http://docs.react-redux-firebase.com/history/v2.0.0/docs/auth.html

  React-MD
  https://react-md.mlaursen.com/components/

  Update
*/
