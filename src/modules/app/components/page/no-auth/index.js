import React, { Component } from 'react'
// import Trianglify from 'react-trianglify'
import Page from 'osi/components/page'

import './no-auth.css'

class NoAuthpage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      // seed: 'Coindash by Eli Sklar',
      // width: window.innerWidth,
      // height: window.innerHeigh,
      // pattern: {
      //   variance: 25,
      //   cell_size: 50,
      //   x_colors: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
      //   y_colors: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58']
      // }
    }
  }

  componentDidMount () {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions.bind(this))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this))
  }

  updateWindowDimensions () {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  render () {
    let { props, state } = this
    let { width, height, seed } = state
    let key = `${width}-${height}-${seed}`

    return (
      <Page className={`no-auth ${props.className}`}>
        <div className='tbg' key={key}>
          {/* <Trianglify width={state.width} height={state.height} seed={state.seed} {...state.pattern} /> */}
        </div>
        {props.children}
      </Page>

    )
  }
}

export default NoAuthpage
