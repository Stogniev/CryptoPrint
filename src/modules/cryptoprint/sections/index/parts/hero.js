import React, { Component } from 'react'

import { Button } from 'react-md'
import Slider from 'react-slick'
import * as Scroll from 'react-scroll' // Imports all Mixins

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
    sub: 'Applying visual cryptographic techniques to keep your private key safe'
  },
  {
    title: 'Making The Digital, Tangible',
    sub: 'Bitcoin, in a form you can touch'
  },
  {
    title: 'The Safest Wallet Around',
    sub: 'Your private key never goes online'
  },
  {
    title: 'Ultimate “Cold-Storage”',
    sub: 'The best way to store cryptocurrency for the long run'
  }
]

class Hero extends Component {
  render () {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false
    }

    return <Slider {...settings} className='video-intro'>
      {heros.map((e, i) => (<div className={`hero hero-${i + 1}`}>
        <div className='content'>
          <h1>{e.title}</h1>
          <h3>{e.sub}</h3>
          <div className='action'>
            <Button raised secondary onClick={scrollTo('preorder')} className='preorder-btn'>Pre-Order Now!</Button>
          </div>
        </div>
        <small className='prototype'>
          The pictures are of an early prototype version - final product may vary.
        </small>
      </div>))}
    </Slider>
  }
}

const HeroSlide = ({num, children, ...props}) => <div>
</div>

export default Hero
