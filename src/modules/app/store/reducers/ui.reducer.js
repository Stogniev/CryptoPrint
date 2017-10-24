import * as types from '../actions/action.const'
import { REHYDRATE } from 'redux-persist/constants'

const initialState = {
  showMenu: false
}

export default function uiReducer (state = initialState, action) {
  switch (action.type) {
    case types.UI_TOGGLE_MENU:
      return Object.assign({}, state, {
        showMenu: action.showMenu
      })

    case REHYDRATE:
      return { ...state, showMenu: false }

    default:
      return state
  }
}
