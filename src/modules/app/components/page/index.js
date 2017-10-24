import React, { Component } from 'react'
import './page.css'

import PageHeader from './page-header'
import PageContent from './page-content'

class Page extends Component {
  render () {
    let { className, children, name = '', routes, router, grid = false, ...props } = this.props
    className = ['page page-component', className, name].filter(e => !!e).join(' ')

    const title = getTitle(children)
    const actions = getActions(children)
    const content = getContent(children)

    const tabs = getTabs(children)

    let actualChildren = children ? cleanChildren(children) : children

    if (!actualChildren || (actualChildren && actualChildren.length === 0)) actualChildren = content
    else if (actualChildren && actualChildren.length > 1) actualChildren.push(content)

    return (
      <div {...props} className={className}>
        {title && <PageHeader title={title} actions={actions} tabs={tabs} router={router} />}
        {!!actualChildren && <PageContent grid={grid}>{actualChildren}</PageContent>}
      </div>
    )
  }
}

const customTags = ['page-content', 'page-title', 'page-actions', 'page-tabs']

export const cleanChildren = (children, cleanTags = customTags) => children.length && typeof children !== 'string'
  ? children
    .filter(e => !!e)
    .filter(e => cleanTags.indexOf(e.type) === -1)
  : (children.type && cleanTags.indexOf(children.type) === -1
    ? children
    : null
  )

const getTitle = children => getSpecificChild('page-title', children)
const getActions = children => getSpecificChild('page-actions', children)
const getTabs = children => getSpecificChild('page-tabs', children)

const getContent = children => getSpecificChild('page-content', children)

export const getSpecificChild = (tag, children) => {
  const isElement = children && children.type && typeof children.length === 'undefined'

  if (!children) return false
  if (!isElement && (!children.length || typeof children === 'string')) return false

  const child = !isElement
    ? children
      .filter(e => !!e)
      .find(e => e.type === tag)
    : (children.type === tag
      ? children
      : null
    )

  return child && child.props.children
}

export default Page
