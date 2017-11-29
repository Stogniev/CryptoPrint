import React, { Component } from 'react'
import Button from 'react-md/lib/Buttons'

export class SocialSection extends Component {
  render () {
    return <section className='social'>
      <h3>Like our products? Interested in Bitcoin and cryptocurrencies in general?</h3>
      <h3>Join our growing Cryptoprint community of like-minded individuals.</h3>
      <ul>
          <li>
              <div>Join our Telegram community</div>
          </li>
          <li>
              <div>Join our Facebook community</div>
          </li>
          <li>              
              <div>Join our Telegram community</div>
          </li>
      </ul>   
      <h3>We are currently working on implementing our token, some of which we be given away to members of our Facebook community.</h3>
      <h3>Join us today to stay updated on Cryptoprint</h3>       
    </section>
  }
}

export default SocialSection
