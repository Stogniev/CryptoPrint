import React, { Component } from 'react'



import { Button } from 'react-md'
// import generate from './raws'
import { generatePages,loadWeb } from './raws'

var svgDatas={ready:false};

loadWeb()
.then( (svgDatas1)=> svgDatas=svgDatas1;console.log('svgs?', svgDatas)  )
.catch( e=> console.log('load templates error',e.stack) );

export class PrintViewSection extends Component {
	
  generatePrivateQRA() {
  let pages=generatePages(svgDatas);
  for(let i=0;i<pages.length;i++)
  {
	  let page=pages[i]
	  let span 
	  span = document.createElement('span')
	  span.addEventListener('click', function () { exportSVG(this, i + '_back') }, false)
	  span.innerHTML = page.back
	  document.getElementById('page_back').prepend(span)
	  
	  span = document.createElement('span')
	  span.addEventListener('click', function () { exportSVG(this, i + '_front') }, false)
	  span.innerHTML = page.front
	  document.getElementById('page_front').prepend(span)
	  
	  	  
	  span = document.createElement('span')
	  span.addEventListener('click', function () { exportSVG(this, i + '_backa') }, false)
	  span.innerHTML = page.backa
	  document.getElementById('page_backa').prepend(span)
	  
	  span = document.createElement('span')
	  span.addEventListener('click', function () { exportSVG(this, i + '_fronta') }, false)
	  span.innerHTML = page.fronta
	  document.getElementById('page_fronta').prepend(span)
	  
	  
	  	  
	  span = document.createElement('span')
	  span.addEventListener('click', function () { exportSVG(this, i + '_backb') }, false)
	  span.innerHTML = page.backb
	  document.getElementById('page_backb').prepend(span)
	  
	  
	  span = document.createElement('span')
	  span.addEventListener('click', function () { exportSVG(this, i + '_frontb') }, false)
	  span.innerHTML = page.frontb
	  document.getElementById('page_frontb').prepend(span)
	  
	}
}
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
