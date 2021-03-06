import React, { Component } from 'react'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import packageJSON from 'package.json'
import semver from 'semver'

export const currentVersion = packageJSON.version

export const versionCompare = (a, b) => semver.gt(a, b)

class VersionNotificationDialog extends Component {
  constructor (props) {
    super(props)
    this.state = { isOpen: false }
  }

  componentWillMount () {
    // Removed because new version of generator doesn't support out-of-bounds requires
    // const readmePath = require('../../../../../CHANGELOG.md')
    //
    // fetch(readmePath)
    //   .then(response => {
    //     return response.text()
    //   })
    //   .then(text => {
    //     this.setState({
    //       markdown: marked(text)
    //     })
    //   })
  }

  componentWillUpdate (nextProps, nextState) {
    const { version } = packageJSON
    const { propertiesLastUpdate: lastUpdate } = nextProps.user
    const { lastVersion } = nextProps.userProps || {}
    const { isOpen } = nextState

    // Check App version state
    if (lastUpdate && !lastVersion && !isOpen) {
      this.props.userActions.showVersionNotification()
    }

    if (!isOpen && lastUpdate && !lastVersion) {
      this.setState({isOpen: true})
    } else if (!isOpen && lastUpdate && semver.gt(version, lastVersion)) {
      this.setState({isOpen: true})
    } else if (isOpen && lastVersion === version) {
      this.setState({isOpen: false})
    }
  }

  handleDismiss () {
    const { uid } = this.props.user.profile
    const { version } = packageJSON

    this.props.userActions.hideVersionNotification(uid, version)
    this.setState({isOpen: false})
  }

  render () {
    const { markdown } = this.state
    const { version } = packageJSON
    const actions = [
      <FlatButton
        label='Dismiss'
        primary
        onTouchTap={this.handleDismiss.bind(this)}
      />
    ]

    return (
      <Dialog
        className='changelog-dialog'
        title={`v${version} Released`}
        actions={actions}
        modal
        autoScrollBodyContent
        open={this.state.isOpen}
      >
        <div dangerouslySetInnerHTML={{__html: markdown}} className='changelog' />
      </Dialog>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VersionNotificationDialog)
