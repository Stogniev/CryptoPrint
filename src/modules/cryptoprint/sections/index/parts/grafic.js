import React, {Component} from 'react'

import {Button} from 'react-md'
import * as Scroll from 'react-scroll' // Imports all Mixins

const scroller = Scroll.scroller
const scrollOptions = {
  delay: 100,
  smooth: true,
  offset: 50 // Scrolls to element + 50 pixels down the page
}
const scrollTo = name => e => scroller.scrollTo(name, scrollOptions)


class Grafic extends Component {

  render() {
    return (
      <section className='grafic' id='grafic'>
        <h3 className='title'>Specifications Graphic</h3>
      </section>
    )
  }
}

export default Grafic
