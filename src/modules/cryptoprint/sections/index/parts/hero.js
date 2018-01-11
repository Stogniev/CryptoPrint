import React, {Component} from 'react'

import {Button} from 'react-md'
import * as Scroll from 'react-scroll' // Imports all Mixins
import LogoOnepager from '../../../bits/onepager-logo'
import Newsletter from './newsletter'



const scroller = Scroll.scroller
const scrollOptions = {
  delay: 100,
  smooth: true,
  offset: 50 // Scrolls to element + 50 pixels down the page
}
const scrollTo = name => e => scroller.scrollTo(name, scrollOptions)

const heros = [
  {
    title: 'Paper Wallets Just Got Better',
    sub: 'Bringing Crypto to the Next Billion People'
  }
]

class Hero extends Component {

  render() {
    return (
      <div className='hero-content'>
        <div className='hero-container'>
          <LogoOnepager />
          {/*<h2>{heros[0].title}</h2>*/}
          <h2>{heros[0].sub}</h2>
          <div className='action'>
            {/*<Button onClick={scrollTo('preorder')} className='circle-btn preorder-btn'><span>buy now</span></Button>*/}
          <Newsletter />
            </div>
        </div>
      </div>
    )
  }
}

export default Hero
