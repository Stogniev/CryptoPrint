import React, {Component} from 'react'

import {Button} from 'react-md'
import Slider from 'react-slick'
import * as Scroll from 'react-scroll' // Imports all Mixins
import LogoOnepager from '../../../bits/onepager-logo'


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
    sub: 'Applying visual cryptographic techniques to keep your private key safe',
    src: './images/product/a.jpg'
  },
  {
    title: 'Making The Digital, Tangible',
    sub: 'Bitcoin, in a form you can touch',
    src: './images/product/b.jpg'
  },
  {
    title: 'The Safest Wallet Around',
    sub: 'Your private key never goes online',
    src: './images/product/c.jpg'
  },
  {
    title: 'Ultimate “Cold-Storage”',
    sub: 'The best way to store cryptocurrency for the long run',
    src: './images/product/d.jpg'
  }
]

class Hero extends Component {

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false
    }

    return (
      <Slider {...settings} className='video-intro'>
        {heros.map((e, i) => (<div className={`hero hero-${i + 1}`}>
          <div className='content'>
            <LogoOnepager />
            <h2>{e.title}</h2>
            <p>{e.sub}</p>
            <div className='action'>
              <Button onClick={scrollTo('preorder')} className='circle-btn preorder-btn'>Join the pre-sale!</Button>
            </div>
          </div>
        </div>))}
      </Slider>
    )
  }
}

export default Hero
