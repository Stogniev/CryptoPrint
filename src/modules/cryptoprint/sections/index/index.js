import React, {Component} from 'react'
import {connect} from 'react-redux'
import {firebaseConnect} from 'react-redux-firebase'

import Hero from './parts/hero'
import Attributes from './parts/attributes'
import Features from './parts/features'
import Team from './parts/team'
// import Advisors from './parts/advisors'
import Community from './parts/community'
import Footer from './parts/footer'
import Preorder from './parts/preorder'
// import Grafic from './parts/grafic'
// import Social from './parts/social'
import Newsletter from './parts/newsletter'
import './index.css'


class SectionIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      progress: 0,
      seed: null
    }
  }

  registerMe() {
    this.props.firebase.login({
      provider: 'google',
      type: 'popup'
    })
  }

  render() {
     // console.log('this.props:', this.props)
    return <div className='index-section'>
      <Hero />
      {/*<Attributes />*/}
      {/*<Features />*/}
      {/* <Testimonials /> */}
      {/* <Grafic /> */}
      {/*<Preorder />*/}
      {/*<Team />*/}
      {/* <AlternativeCTA /> */}
      {/* {<Signin />} */}
      {/* <Advisors /> */}
      {/*<Community />*/}
      {/* <Social /> */}
      {/*<Newsletter />*/}
      <Footer />
    </div>
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
