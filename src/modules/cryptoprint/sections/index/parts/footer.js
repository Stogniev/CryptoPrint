import React, { Component } from 'react'

import LogoOnepager from '../../../bits/onepager-logo'

export class FooterSection extends Component {
  render () {
    return <footer className='footer'>
      <div className="flex-container">
        <LogoOnepager />
        <div className="designed">
          <p>Designed by Porat Shalev & Co.</p>
        </div>
      </div>
    </footer>
  }
}

export default FooterSection
