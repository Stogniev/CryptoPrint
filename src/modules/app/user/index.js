import Firebase from 'services/firebase'

const db = Firebase.database()

export const usersPath = 'users'
export const profilesPath = `${usersPath}/profiles`

export const profileFactory = userData => {
  const { uid, email, displayName, photoURL } = userData
  const profile = {
    uid,
    displayName,
    photoURL,
    username: `temp-user-${Math.floor(Math.random() * 1000)}`,
    email,
    type: 'tester'
  }

  return profile
}

const makeUserProfile = profile => {
  const ref = db.ref(profilesPath)
  return ref.child(profile.uid).set(profile)
    .catch(error => {
      console.log('new user profile error?', error)
      return error
    })
}

export const newUserProfile = userData => {
  console.log('user data:', userData)

  const { uid, email, displayName, photoURL } = userData.user

  let profile = {
    uid,
    displayName,
    photoURL,
    username: `temp-user-${Math.floor(Math.random() * 1000)}`,
    email,
    type: 'tester'
  }

  // check user profile exist
  return getUserProfile(uid)
    .then(existingUser =>
      existingUser ? false : makeUserProfile(profile))
}

export const getUserProfile = uid => db.ref(profilesPath).child(uid)
  .once('value')
  .then(snp => snp.val())
