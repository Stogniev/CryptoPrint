import React, { Component } from 'react'

class Hero extends Component {
  render () {
    return <section className='video-intro'>
      {/* <div id='mask'></div> */}
      <h1>Paper Wallets Just Got Better.</h1>
      <h3>Applying visual cryptographic techniques to safeguard your private key in public</h3>
      {/* {<div className="video-block video-wrapper">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/Vd8s4cXu4Zs" frameborder="0" allowfullscreen></iframe>
      </div>} */}
      <a href='#' className='btn'>Pre-Order Now!</a>
    </section>
  }
}

export default Hero
