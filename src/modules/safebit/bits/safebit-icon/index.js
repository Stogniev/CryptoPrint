import React, { Component } from 'react'
import IconSVG from './safebit-icon.svg'
import './icon.css'

class Logo extends Component {
  render () {
    const {rotate, ...props} = this.props

    return rotate ? <div className='spinning-icon'><IconSVG rotate={rotate} {...props} /></div> : <IconSVG {...this.props} />
  }
}

export default Logo
