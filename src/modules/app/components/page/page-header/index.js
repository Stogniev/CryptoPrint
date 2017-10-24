import React, { Component } from 'react'

import Toolbar from 'react-md/lib/Toolbars'
import { Tabs, Tab } from 'react-md/lib/Tabs'
import Paper from 'react-md/lib/Papers'

import './page-header.css'

const PageToolbar = ({title, actions, zDepth = 0}) => <Toolbar
  className='page-header'
  title={title}
  actions={actions}
  zDepth={zDepth}
/>

class PageHeader extends Component {
  render () {
    const { title, actions, tabs, router } = this.props

    if (tabs && tabs.length) {
      const activeTab = tabs.findIndex(e => e.route && router.isActive(e.route, true))

      return <Paper zDepth={1}>
        <PageToolbar title={title} actions={actions} component='div' />
        <Tabs className='page-tabs' tabId='page-tabs' activeTabIndex={activeTab} onTabChange={() => { }}>
          {tabs.map((e, key) => <Tab label={e.label} key={key}
            onClick={(index, id, controlsId, children, event) => e.route && router.push(e.route)}
          />)}
        </Tabs>
      </Paper>
    } else {
      return <PageToolbar zDepth={1} title={title} actions={actions} />
    }
  }
}

export default PageHeader
