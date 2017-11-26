import React, { Component } from 'react'

import Slider from 'react-slick'

const heros = [
  {
    title: 'Paper Wallets Just Got Better',
    sub: 'Applying visual cryptographic techniques to keep your private key safe'
  },
  {
    title: 'Making The Digital, Tangible',
    sub: 'The future of money - In a form you can touch'
  },
  {
    title: 'Ultimate Security',
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
      slidesToScroll: 1
    }

    return <Slider {...settings} className='video-intro'>
      {heros.map((e, i) => (<div className={`hero hero-${i + 1}`}>
        <div className='content'>
          <h1>{e.title}</h1>
          <h3>{e.sub}</h3>
          <a href='#' className='btn'>Pre-Order Now!</a>
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
