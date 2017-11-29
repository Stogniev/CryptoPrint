import React, { Component } from 'react'
import Button from 'react-md/lib/Buttons'

export class SocialSection extends Component {
  render () {
    return <section className='social'>
      <h3>Join our growing Cryptoprint community of like-minded individuals.</h3>
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
      <h3>We are currently working on implementing our token, some of which will be given away to members of our Facebook community.</h3>
      <h3>Join us today to stay updated on Cryptoprint!</h3>       
    </section>
  }
}

export default SocialSection
