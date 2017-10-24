import { combineReducers } from 'redux'
import { firebaseStateReducer } from 'react-redux-firebase'

import ui from './ui.reducer'

const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
  ui
})

const appReducer = (state, action) => {
  return rootReducer(state, action)
}

export default appReducer
