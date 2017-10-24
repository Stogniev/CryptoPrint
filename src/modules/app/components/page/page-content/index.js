import React, { Component } from 'react'

import { cleanChildren, getSpecificChild } from '../'

import './page-content.css'

let DefaultSidenav = props => <nav>Sidenav</nav>

class PageContent extends Component {
  render () {
    let { className, children, ...props } = this.props
    className = ['page page-component', className].join(' ')

    const sidenav = getSidenav(children)

    let actualChildren = children ? cleanChildren(children, ['sidenav']) : children

    actualChildren = [sidenav ? <nav key='custom-sidenav'>{sidenav}</nav> : <DefaultSidenav key='default-sidenav' />, ...actualChildren]
      // .map((c, i) => Object.assign({}, c, { props: { ...c.props, key: i } }))
    false && console.log(props)

    return <div className={`page-content content grid`}>
      {actualChildren}
    </div>
  }
}

const getSidenav = children => getSpecificChild('sidenav', children)

export const setDefaultSidenav = sidenav => { DefaultSidenav = sidenav }

export default PageContent
