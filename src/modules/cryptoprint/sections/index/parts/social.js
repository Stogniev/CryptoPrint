import React, { Component } from 'react'
import Button from 'react-md/lib/Buttons'

// import ActionHome from 'material-ui/svg-icons/action/home'

import Facebook from 'cryptoprint/bits/custom-icons/facebook'
import Telegram from 'cryptoprint/bits/custom-icons/telegram'

export class SocialSection extends Component {
  render () {
    return <section className='social'>
      <h2>Contact Us</h2>
      <p>Come check out our growing Cryptoprint community of like-minded individuals.</p>
      <div className='buttons'>
        <Button raised className='facebook' href='https://www.facebook.com/groups/322471981559829/' target='_blank' svg iconEl={<Facebook />} label='Join our Facebook' />
        <Button raised className='telegram' href='https://t.me/cryptoprint' target='_blank' svg iconEl={<Telegram />} label='Join our Telegram' />
      </div>
      <h3>Join us today to stay updated on Cryptoprint!</h3>
    </section>
  }
}

export default SocialSection
