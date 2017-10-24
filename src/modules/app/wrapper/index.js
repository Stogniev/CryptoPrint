import React, { Component } from 'react'
import { connect } from 'react-redux'

import Header from 'app/components/header'

import './app.css'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <Header style={{position: 'sticky'}} />
        <div className='main-container'>
          {this.props.children}
        </div>
        {/* <VersionNotificationDialog /> */}
      </div>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
