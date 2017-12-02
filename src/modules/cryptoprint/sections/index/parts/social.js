import React, { Component } from 'react'
import Button from 'react-md/lib/Buttons'

export class SocialSection extends Component {
  render () {
    return <section className='social'>
      <h3>Come check out our growing Cryptoprint community of like-minded individuals.</h3>
      <ul>
          <li>
              <i className="fa fa-telegram" aria-hidden="true"></i>
              <div>Join our Telegram</div>
          </li>
          <li>
              <i className="fa fa-facebook" aria-hidden="true"></i>
              <div>Join our Facebook</div>
          </li>
      </ul>   
      <h3>Join us today to stay updated on Cryptoprint!</h3>       
    </section>
  }
}

export default SocialSection
