import React, { Component } from 'react'

import { Button } from 'react-md'
import raws from './raws'

export class PrintViewSection extends Component {
  doGenerate () {
    console.log('running generate...')
    raws()
    console.log('done')
  }
  render () {
    return <div>
      <h2>Welcome to PrintView PRV</h2>
      <Button raised onClick={e => this.doGenerate()} label='Generate' />
      <div id='page_back_on_transparent_data' />
    </div>
  }
}

export default PrintViewSection
