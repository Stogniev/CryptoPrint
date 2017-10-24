import React, { Component } from 'react'

import Avatar from 'material-ui/Avatar'
import SocialPerson from 'material-ui/svg-icons/social/person'
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less'
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import FlatButton from 'material-ui/FlatButton'
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover'

import packageJson from '../../../../../../package.json'

const adminStyle = { boxShadow: '0px 0px 12px 1px #ffcc80' }
const gmodeStyle = { boxShadow: '0px 0px 12px 4px #aa00ff' }

const UserAvatar = ({photoUrl,
  size = 64,
  gmode = false,
  isAdmin = false,
  style = (gmode && gmodeStyle) || (isAdmin && adminStyle) || {},
  ...props}) => photoUrl
    ? <Avatar src={photoUrl} size={size} style={style} />
    : <SocialPerson className='navatar' style={{width: size, color: '#EEE', height: size, ...props.style}} />

class UserMenu extends Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false
    }
  }

  handleTouchTap (event) {
    // This prevents ghost click.
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget
    })
  }
  handleLogout (event) {
    event.preventDefault()
    this.props.userActions.logout()
  }

  handleRequestClose () {
    this.setState({ open: false })
  }
  handleVersionClick () {
    console.log('User', this.props.user)
    console.log('Version', packageJson.version)
  }

  render () {
    const { user } = this.props
    const { photoUrl, name, email } = user && user.profile

    const displayName = name || email.split('@').shift()

    return (
      <div>
        <FlatButton
          onClick={this.handleTouchTap.bind(this)}
          style={{
            color: '#FFF',
            padding: 0,
            height: '100%'
          }}
          labelStyle={{textTransform: 'none'}}
          className='user-menu'
        >
          <UserAvatar
            isAdmin={this.props.isAdmin}
            gmode={this.props.gmode}
            photoUrl={photoUrl} size={32} />
          <span className='name'>{displayName}</span>

          {!this.state.open && <NavigationExpandMore className='expand' style={{color: '#FFF'}} />}
          {this.state.open && <NavigationExpandLess className='expand' style={{color: '#FFF'}} />}
        </FlatButton>
        <Popover
          className='user-popover'
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.handleRequestClose.bind(this)}
          animation={PopoverAnimationVertical}
        >
          <div className='profile'>
            <UserAvatar
              photoUrl={photoUrl} size={64} />
            <div className='details'>
              {name && <h3>{name}</h3>}
              <h4>{email}</h4>
            </div>

          </div>
          <div className='actions'>
            <FlatButton
              style={{height: 'auto'}}
              className='version'
              label={`v${packageJson.version}`}
              onClick={e => this.handleVersionClick(e)} />
            <span className='spacer' />
            <FlatButton
              className='signout'
              style={{height: 'auto'}}
              label='Sign out'
              onClick={this.props.onSignout} />
          </div>
        </Popover>
      </div>
    )
  }
}

export default UserMenu
