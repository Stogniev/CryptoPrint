import React, { Component } from 'react'

import FacebookMonoIcon from '../../../bits/custom-icons/facebook-mono'
// import TwitterIcon from '../../../bits/custom-icons/twitter'
import TelegramMonoIcon from '../../../bits/custom-icons/telegram-mono'
// import SlackIcon from '../../../bits/custom-icons/slack'

export class CommunitySection extends Component {
  render () {
    return <section className='community' id='community'>
      <h3 className='title'>Community</h3>
      <div className="flex-container">
        <div className='img-wrap'>
          <img src="./images/onepager/community.png" alt="community"/>
        </div>
        <div className="text text-right">
          {/*<p>Follow us over on any of our community channels, over here, on telegram and on slack.</p>*/}
          <ul className="social-links">
            <li><a href="https://www.facebook.com/cryptoprint"><FacebookMonoIcon/></a></li>
            {/* <li><a href="https://twitter.com/"><TwitterIcon/></a></li> */}
            <li><a href="https://t.me/cryptoprint"><TelegramMonoIcon/></a></li>
            {/* <li><a href="www.slack.com/"><SlackIcon/></a></li> */}
          </ul>
        </div>
      </div>
    </section>
  }
}

export default CommunitySection
