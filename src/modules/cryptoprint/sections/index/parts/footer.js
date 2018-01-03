import React, { Component } from 'react'

import LogoOnepager from '../../../bits/onepager-logo'
import FacebookMonoIcon from '../../../bits/custom-icons/facebook-mono'
import TwitterIcon from '../../../bits/custom-icons/twitter'
import TelegramMonoIcon from '../../../bits/custom-icons/telegram-mono'
import SlackIcon from '../../../bits/custom-icons/slack'

export class FooterSection extends Component {
  render () {
    return <footer className='footer'>
      <div className='footer-top'>
        <div className='container'>
          <div className='flex-container'>
            <div>
              <LogoOnepager />
            </div>
            <nav>
              <h4>Sitemap</h4>
              <ul>
                <li><a href='/'></a></li>
                <li><a href='/'></a></li>
                <li><a href='/'></a></li>
                <li><a href='/'></a></li>
                <li><a href='/'></a></li>
              </ul>
            </nav>
            <div className='resources'>
              <h4>Resources</h4>
              <button className='circle-btn'>White Paper</button>
            </div>
            <div className='contact'>
              <h4>Contact us</h4>
              <a href='email:contact@cryptoprint.io'>contact@cryptoprint.io</a>
              <ul className='social-links'>
                <li><a href='https://www.facebook.com/cryptoprint'><FacebookMonoIcon/></a></li>
                {/*<li><a href='https://twitter.com/'><TwitterIcon/></a></li>*/}
                <li><a href='https://t.me/cryptoprint'><TelegramMonoIcon/></a></li>
                {/*<li><a href='www.slack.com/'><SlackIcon/></a></li>*/}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className='footer-bottom'>
        <div className='container'>
          <div className='flex-container'>
            <span className='copyright'>Copyright 2017 - Cryptoprint.io</span>
            <span className='designed'>Designed by Porat Shalev &amp; Co.</span>
          </div>
        </div>
      </div>
    </footer>
  }
}

export default FooterSection
