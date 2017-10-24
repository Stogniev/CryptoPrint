import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducers'
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant'
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist'
import { reactReduxFirebase } from 'react-redux-firebase'

import Firebase from 'services/firebase'

import { profilesPath, profileFactory } from 'app/user'

const rrfConfig = {
  userProfile: profilesPath,
  profileFactory
}

const __DEV__ = process.env.NODE_ENV === 'development'

export default function configureStore (initialState) {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk, reduxImmutableStateInvariant()]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (__DEV__) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  // ======================================================
  // Store Instantiation
  // ======================================================
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      reactReduxFirebase(Firebase, rrfConfig),
      applyMiddleware(...middleware),
      autoRehydrate(),
      ...enhancers
    )
  )

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  // store.unsubscribeHistory = browserHistory.listen(updateLocation(store))

  // begin periodically persisting the store with a transform for the immutable state
  persistStore(store)

  return store
}
