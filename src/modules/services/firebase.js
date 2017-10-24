import * as firebase from 'firebase'

const {
  REACT_APP_FIREBASE_API_KEY: apiKey,
  REACT_APP_FIREBASE_AUTH_DOMAIN: authDomain,
  REACT_APP_FIREBASE_DATABASE_URL: databaseURL,
  REACT_APP_FIREBASE_PROJECT_ID: projectId,
  REACT_APP_FIREBASE_STORAGE_BUCKET: storageBucket,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId
} = process.env

export const config = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId
}

try {
  firebase.initializeApp(config)
} catch (err) {
  console.error('Unable to initialize Firebase connection:', err)
}

export const database = firebase.database()

export default firebase
