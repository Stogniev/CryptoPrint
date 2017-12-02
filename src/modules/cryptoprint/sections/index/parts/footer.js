import React, { Component } from 'react'

import Favorite from 'material-ui/svg-icons/action/favorite'

export class FooterSection extends Component {
  render () {
    return <section className='footer'>
      <article className='with-love'>
        Made with <Favorite /> in Tel Aviv
      </article>
      <article className='year'>
        Anno 2017
      </article>
    </section>
  }
}

export default FooterSection
