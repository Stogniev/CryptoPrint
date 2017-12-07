import React from 'react'
import { Route, IndexRoute } from 'react-router'

// import { requireAuth, redirectIfAuth } from 'app/auth'

import App from './wrapper'
import AppWrap from './wrapper/app-wrap'

import SectionIndex from 'cryptoprint/sections/index'

// import SectionSignin from 'cryptoprint/sections/signin'
// import SectionLogin from 'cryptoprint/sections/signin/login'
// import SectioSignup from 'cryptoprint/sections/signin/signup'
// import PrintViewSection from 'cryptoprint/sections/print-view'

const Route404 = props => <div className='404-not-found'>
  <h1>404 Not found</h1>
  <p>You've found something we don't have.</p>
  <p>If you think we should have it, drop us a line at errors@cryptoprint.io</p>

</div>

export default (
  <Route path='/' component={AppWrap}>
    <Route component={App}>
      <IndexRoute component={SectionIndex} />
    </Route>

    {/* <Route path='/soon' component={SectionSignin} onEnter={redirectIfAuth('/')}>
      <IndexRoute component={SectionLogin} />
      <Route path='signup' component={SectioSignup} />
    </Route> */}
    <Route path='*' component={Route404} />
  </Route>
)
