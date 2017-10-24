import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { browserHistory, Router } from 'react-router'
import { persistStore } from 'redux-persist'
import localforage from 'localforage'

import configureStore from 'app/store/configureStore'
import Analytics from 'services/google-analytics'
import { listener as KeenListener } from 'services/keen'

import registerServiceWorker from './registerServiceWorker'

import routes from 'app/routes'

import './index.css'

const store = configureStore()

// Register analytics listener
browserHistory.listen(Analytics.listener) // google
browserHistory.listen(KeenListener) // keen.io

class RouterProvider extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rehydrated: false
    }
  }

  render () {
    return (
      <Router history={browserHistory}>
        {routes}
      </Router>
    )
  }

  componentWillMount () {
    persistStore(store, { storage: localforage }, () => {
      this.setState({ rehydrated: true })
    })
  }
}

function mapStateToProps (state, ownProps) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {}
}

const AppProviderWithRedux = connect(mapStateToProps, mapDispatchToProps)(RouterProvider)

ReactDOM.render(
  <Provider store={store}>
    <AppProviderWithRedux />
  </Provider>, document.getElementById('root'))

registerServiceWorker()
