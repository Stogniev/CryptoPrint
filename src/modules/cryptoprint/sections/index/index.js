import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firebaseConnect} from 'react-redux-firebase'

import Hero from './parts/hero'
import Attributes from './parts/attributes'
import Team from './parts/team'
import Footer from './parts/footer'
import Preorder from './parts/preorder'
import Social from './parts/social'
import Newsletter from './parts/newsletter'
import './index.css'

import CircularProgress from 'material-ui/CircularProgress'

class SectionIndex extends Component {
  constructor() {
    super()

    this.state = {
      progress: 0,
      seed: null,
      isLoading: false
    }
  }

  registerMe() {
    this.props.firebase.login({
      provider: 'google',
      type: 'popup'
    })
  }

  componentDidMount() {
    setTimeout(() => this.setState({isLoading: true}), 1500)
  }

  render() {
    // console.log('this.props:', this.props)
    if (!this.state.isLoading) {
      return (
        <div className='preloader-wrap'>
          <CircularProgress/>
        </div>
      )
    } else {
      return <div className='index-section'>
        <Hero/>
        <Attributes/>
        {/* <Testimonials /> */}
        <Team/>
        {/* <AlternativeCTA /> */}
        <Preorder/>
        {/* {<Signin />} */}
        <Social/>
        <Newsletter/>
        <Footer/>
      </div>
    }
  }
}


const fbConnectedIndex = firebaseConnect([
  'authErrors',
  '/test-addresses'
])(SectionIndex)

export default connect(
  ({firebase: {auth, authError, profile, data}}) => ({
    auth, authError, profile, myAddresses: data['test-addresses']
  })
)(fbConnectedIndex)
