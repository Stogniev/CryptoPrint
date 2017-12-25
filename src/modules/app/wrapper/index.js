import React, { Component } from 'react'
import { connect } from 'react-redux'

import Header from 'app/components/header'

import './app.css'

function imagesLoaded(parentNode) {
  const imgElements = parentNode.querySelectorAll('img')
  for (const img of imgElements) {
    if (!img.complete) {
      return false
    }
  }
  return true
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      loading: true
    }
    this.handleImageChange = this.handleImageChange.bind(this)

  }

  handleImageChange() {
    const galleryElement = this.refs.gallery
    this.setState({
      loading: !imagesLoaded(galleryElement)
    })
  }

  renderSpinner() {
    if (!this.state.loading) {
      return null
    }
    return (
      <div className='preloader-wrap'>
        <div className='loader'>
          <div className='shadow'></div>
          <div className='box'></div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className='App'>
        <Header style={{position: 'sticky'}}/>
        <div className='main-container' loading={this.state.loading}>
          {this.props.children}
        </div>
        {/* <VersionNotificationDialog /> */}
        <div className='gallery' ref='gallery'>
          {this.renderSpinner()}
          <div className='images'>
            <img
              src='./images/cristina-gottardi-177261%20(1).png'
              onLoad={this.handleImageChange}
            />
          </div>
        </div>
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
