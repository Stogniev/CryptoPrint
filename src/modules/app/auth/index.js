import firebase from 'services/firebase'

const Auth = firebase.auth()

let initialized = false
let currentUser = Auth.currentUser
let credential

Auth.onAuthStateChanged(user => {
  currentUser = user
  if (!initialized) initialized = true
})

export const signOut = () => {
  return Auth.signOut()
    .then((e) => {
      currentUser = null
      return true
    })
}

export const getCredential = () => credential

export const signInWithEmailAndPassword = (email, password) => {
  return Auth.signInWithEmailAndPassword(email, password)
  .then((data) => {
    currentUser = data
    return data
  })
}

export const signInWithProvider = provider => {
  if (provider === 'google') {
    const Provider = new firebase.auth.GoogleAuthProvider()
    Provider.addScope('profile')
    Provider.addScope('email')
    Provider.addScope('https://www.googleapis.com/auth/plus.me')
    Provider.addScope('https://www.googleapis.com/auth/userinfo.email')
    Provider.addScope('https://www.googleapis.com/auth/userinfo.profile')

    return Auth.signInWithPopup(Provider)
      .then(result => {
        currentUser = result.user
        credential = result.credential
        return result
      })
  }
}

const waitToInitialize = na => {
  return new Promise((resolve, reject) => {
    if (initialized) resolve()
    else {
      const intId = setInterval(() => {
        if (initialized) {
          resolve()
          clearInterval(intId)
        }
      }, 80)
    }
  })
}

export const getCurrentUser = () => waitToInitialize().then(() => currentUser)

/**
 * Use with onEnter route prop to restrict areas to authenticated users
 *
 * Usage example:
 *
 * ```jsx
 * import { requireAuth } from 'app/auth'
 *
 * <Route path='/dashboard' component={App} onEnter={requireAuth}>
 * ```
 */
export const requireAuth = (url = '/login') => (nextState, replace, done) => {
  if (initialized && currentUser && currentUser.uid) done()
  else if (initialized && (!currentUser || currentUser.uid)) {
    replace(url)
    done('Unauthorized Access')
  } else {
    waitToInitialize().then(na => {
      if (!currentUser || !currentUser.uid) {
        replace(url)
      }
      done()
    })
  }
}

/**
 * Use with onEnter route configuration to redirect a user to the specified
 * location in the `to` param if the user is authenticated
 *
 * Usage example:
 *
 * ```jsx
 * import { redirectIfAuth } from 'app/auth'
 *
 * <Route path='/login' onEnter={redirectIfAuth('/dashboard')}>
 * ```
 *
 * If user tries to enter `/login` but is already authenticated he will be
 * redirected to `/dashboard`
 *
 * @param  {string} to Where to transition the user to
 * @return {function}    Function to be passed to onEnter prop in `<Route/>`
 */
export const redirectIfAuth = to => (nextState, replace, done) => {
  if (initialized && currentUser && currentUser.uid) {
    replace(to)
    done()
  } else if (initialized && (!currentUser || currentUser.uid)) done()
  else {
    waitToInitialize().then(na => {
      if (currentUser && currentUser.uid) replace(to)
      done()
    })
  }
}

export default { ...Auth, signOut, signInWithEmailAndPassword, signInWithProvider }
