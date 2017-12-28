import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import List from 'react-md/lib/Lists/List'
import ListItem from 'react-md/lib/Lists/ListItem'
import Divider from 'react-md/lib/Dividers'
import Toolbar from 'react-md/lib/Toolbars'
import Drawer from 'react-md/lib/Drawers'
import Button from 'react-md/lib/Buttons/Button'

import FlatButton from 'material-ui/FlatButton'

import CryptoprintIcon from 'cryptoprint/bits/cryptoprint-icon'

import ActionHome from 'material-ui/svg-icons/action/home'
import ActionCardTravel from 'material-ui/svg-icons/action/card-travel'
import ActionDoneAll from 'material-ui/svg-icons/action/done-all'
import ActionSupervisorAccount from 'material-ui/svg-icons/action/supervisor-account'
import FileFolderShared from 'material-ui/svg-icons/file/folder-shared'
import Subheader from 'react-md/lib/Subheaders'

import ActionSettingsBackupRestore from 'material-ui/svg-icons/action/settings-backup-restore'
import { recordEvent } from 'services/keen'

import { currentVersion, versionCompare } from 'app/version'

import './sidenav.css'

const iconStyle = {
  width: 19,
  height: 19
}

const isActive = (path, to) => path === to

class SideNavigation extends Component {
  constructor (props) {
    super(props)

    this.state = {
      shouldShowTourReset: false
    }
  }

  defaultProps () {
    return { items: [
            {title: 'dashboard', icon: 'tachometer'}
    ] }
  }

  resetDashboardTour () {
    const { uid } = this.props.user.profile
    recordEvent('tour-reset', {
      from: 'sidebar'
    }, () => {
      this.props.userActions.hideTourGuide(uid, '0.4.2')
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps && nextProps.user && nextProps.user.properties) {
      const { user: { properties: { lastTourVersion = '0.0.0' } } } = nextProps || {}
      const isNewVersion = versionCompare(currentVersion, lastTourVersion)
      const shouldShowTourReset = !isNewVersion && lastTourVersion !== '0.0.0'

      if (this.state.shouldShowTourReset !== shouldShowTourReset) {
        this.setState({ shouldShowTourReset })
      }
    }
  }

  visibilityToggle () {
    const { uiActions } = this.props
    uiActions.toggleMenu()
  }

  render () {
    const { shouldShowTourReset } = this.state
    const { favorites, showMenu, portfolios } = this.props
    const { userPortfolios } = portfolios

    const singlePortfolio = (!userPortfolios || !userPortfolios.length || userPortfolios.length < 2)

    const favoriteItems = favorites.map(pf => {
      return {
        title: pf.portfolio.name,
        route: `/p/${pf.portfolio.pid}`
      }
    })
    const disabled = true
    const menuItems = [
      {title: 'Dashboard', icon: <ActionHome style={iconStyle} />, route: '/dashboard'},
      {title: `Portfolio${(!singlePortfolio && 's') || ''}`, icon: <ActionCardTravel style={iconStyle} />, route: '/portfolios', children: favoriteItems, id: 'portfolios'},
      {title: 'Copy ICO', icon: <ActionDoneAll style={iconStyle} />, route: '/copyCrypto', style: { paddingTop: '11px' }, disabled}
    ]

    const secondaryItems = [
      {title: 'Reset Tour', icon: <ActionSettingsBackupRestore style={iconStyle} />, onClick: () => this.resetDashboardTour(), hide: !shouldShowTourReset}
    ]

    const adminItems = [
      { title: 'Users', icon: <ActionSupervisorAccount style={iconStyle} />, route: '/admin/users' },
      { title: 'Portfolios', icon: <FileFolderShared style={iconStyle} />, route: '/admin/portfolios' },
      { title: 'Assets', icon: <FileFolderShared style={iconStyle} />, route: '/admin/onepager' }
    ]

    const close = <Button className='dismiss' icon onClick={e => this.visibilityToggle()}>close</Button>

    const isFullwidth = Drawer.matchesMedia(960)

    const header = <Toolbar
      nav={close}
      className='md-divider-border md-divider-border--bottom'
                   >
      <div className='beta-brand'>
        <FlatButton
          href='/'
          onClick={e => {
            e.preventDefault()
            browserHistory.push('/')
          }}
          className='brand'
          style={{padding: 3, margin: '10px'}}>
          <CryptoprintIcon className='cryptoprint-icon' />
        </FlatButton>
      </div>
    </Toolbar>

    return (
      <Drawer className='sidenav'
        onVisibilityToggle={e => this.visibilityToggle()}
        header={header}
        autoclose
        style={{ zIndex: 100 }}
        defaultMedia='desktop'
        desktopMinWidth={960}
        visible={isFullwidth || showMenu}
      >
        <List className='main'>
          {menuItems
            .map(m => Object.assign(m, { active:
              (m.id === 'portfolios' && singlePortfolio && (/^\/p\/ /).test(this.props.currentPathname)) ||
              isActive(m.route, this.props.currentPathname) }))
            .map((m, i) =>
              <ListItem
                key={i}
                className={m.active ? 'active' : null}
                activeClassName='active'
                active={m.active}
                to={m.route}
                defaultOpen={!!m.children && !!m.children.length}
                isOpen={!!m.children && !!m.children.length}
                onClick={e => !isFullwidth && this.visibilityToggle()}
                expanderIconChildren={<span />}

                nestedItems={m.children ? [
                  <Divider key='top-divider' />,
                  <Subheader key='favorite-subheader' primaryText='Favorite Portfolios' />,
                  ...m.children
                  .map(c => Object.assign(c, { active: isActive(c.route, this.props.currentPathname) }))
                  .map((c, ci) => <ListItem
                    key={ci}
                    inset
                    className={c.active ? 'active' : null}
                    activeClassName='active'
                    active={c.active}
                    to={c.route}
                    primaryText={c.title}
                    onClick={e => !isFullwidth && this.visibilityToggle()}
                    component={Link}
                                  />),
                  <Divider key='bot-divider' />
                ] : null}

                primaryText={m.title}
                leftIcon={m.icon}
                disabled={m.disabled}
                component={Link} />
            )}
        </List>

        <div className='spacer' />

        <List className='secondary'>
          {secondaryItems
            .map(m => Object.assign(m, { active: isActive(m.route, this.props.currentPathname) }))
            .filter(m => !m.hide)
            .map(makeSideItem)
          }
        </List>

        {this.props.isAdmin && (
          <List className='admin'>
            <Subheader primaryText='Administration' />
            {adminItems
              .map(m => Object.assign(m, { active: isActive(m.route, this.props.currentPathname) }))
              .map((m, i) =>
                <ListItem
                  key={i}
                  className={m.active ? 'active' : null}
                  activeClassName='active'
                  active={m.active}
                  to={m.route}
                  primaryText={m.title}
                  leftIcon={m.icon}
                  disabled={m.disabled}
                  component={Link} />
              )}

          </List>
        )}
      </Drawer>
    )
  }
}

const makeSideItem = (m, i) => (m.route &&
  <ListItem
    key={i}
    className={m.active ? 'active' : null}
    activeClassName='active'
    active={m.active}
    to={m.route}
    primaryText={m.title}
    leftIcon={m.icon}
    disabled={m.disabled}
    component={Link} />
  ) || (m.onClick &&
    <ListItem
      key={i}
      className={m.active ? 'active' : null}
      activeClassName='active'
      active={m.active}
      onClick={m.onClick}
      primaryText={m.title}
      leftIcon={m.icon}
      disabled={m.disabled}
      component={Link} />
    )

function mapStateToProps (state, ownProps) {
  const { portfolios } = state.portfolio
  const favorites = portfolios.filter(({ portfolio: { options: { favorite = false } = { } } }) => favorite)

  const { showMenu } = state.ui

  return {
    showMenu,
    favorites,
    user: state.user,
    isAdmin: state.admin.active,
    portfolios: state.portfolio
  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SideNavigation)
