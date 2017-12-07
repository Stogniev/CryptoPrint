import React, { Component } from 'react'

import { Button } from 'react-md'
import Favorite from 'material-ui/svg-icons/action/favorite'

import TelegramMonoIcon from 'cryptoprint/bits/custom-icons/telegram-mono'
import FacebookMonoIcon from 'cryptoprint/bits/custom-icons/facebook-mono'

export class FooterSection extends Component {
  render () {
    return <section className='footer'>
      <article className='with-love'>
        Made with <Favorite /> in Tel Aviv
      </article>
      <article className='social'>
        <Button icon href='https://t.me/cryptoprint' ><TelegramMonoIcon /></Button>
        <Button icon href='https://www.facebook.com/cryptoprint/' ><FacebookMonoIcon /></Button>
      </article>
      <article className='year'>
        Anno 2017
      </article>
    </section>
  }
}

export default FooterSection
