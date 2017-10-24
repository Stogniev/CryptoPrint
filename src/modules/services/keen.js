// import config from '../../config'
import KeenTracking from 'keen-tracking'

import packageJson from 'package.json'

const {
  REACT_APP_KEEN_PROJECT_ID: projectId,
  REACT_APP_KEEN_WRITE_KEY: writeKey
} = process.env

// Configure a client instance
var client = new KeenTracking({ projectId, writeKey })
let loggingDisabled = false

client.addEvent('app-load', {
  ip_address: `${'$'}{keen.ip}`,
  keen: {
    addons: [
      {
        name: 'keen:ip_to_geo',
        input: {
          ip: 'ip_address'
        },
        output: 'ip_geo_info'
      }
    ]
  }
})

let myglobs = (eventCollection) => {
  let props = {
    version: packageJson.version,
    landing: window.location.toString(),
    hostname: window.location.host,
    env: process.env.NODE_ENV
  }

  return props
}
client.setGlobalProperties(myglobs)

client.recordEvent('app-load', {
  loadTime: Date.now() - window.startLoad
})

export const listener = location => {
  if (!loggingDisabled) {
    client.recordEvent('pageviews', {
      page: location.pathname
    })
  }
}

export const recordEvent = (name, opts, cb) => {
  if (!loggingDisabled) {
    client.recordEvent(name, opts, cb)
  }
}

export const recordEvents = (events, cb) => {
  if (!loggingDisabled) {
    client.recordEvents(events, cb)
  }
}

export const disable = () => {
  loggingDisabled = true
}

export const enable = () => {
  loggingDisabled = false
}
