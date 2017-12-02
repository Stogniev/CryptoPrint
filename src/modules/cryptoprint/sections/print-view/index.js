import React, { Component } from 'react'



import { Button } from 'react-md'
// import generate from './raws'
import { generatePrivateQRA } from './raws'



export class PrintViewSection extends Component {
  doGenerate () {

	document.getElementById('page_back').innerHTML=""
	document.getElementById('page_front').innerHTML=""
	document.getElementById('page_backa').innerHTML=""
	document.getElementById('page_fronta').innerHTML=""
	document.getElementById('page_backb').innerHTML=""
	document.getElementById('page_frontb').innerHTML=""
    generatePrivateQRA()
    console.log('done')
  }
  render () {
    return <div>
      <h2>Welcome to PrintView PRV</h2>
      <Button raised onClick={e => this.doGenerate()} label='Generate' />
      <div id='page_back' />
      <div id='page_front' />
      <div id='page_backa' />
      <div id='page_fronta' />
      <div id='page_backb' />
      <div id='page_frontb' />

    </div>
  }
}

export default PrintViewSection
