import ReactGA from 'react-ga'
import packageJson from 'package.json'

const { REACT_APP_GOOGLE_ANALYTICS: propertyID } = process.env

const ga = (...args) => ReactGA.ga(...args)
const pageview = path => ReactGA.pageview(path)
const modalview = modalName => ReactGA.modalview(modalName)
const event = args => ReactGA.event(args)
const timing = args => ReactGA.timing(args)
const outboundLink = (args, hitCallback) => ReactGA.outboundLink(args, hitCallback)
const exception = args => ReactGA.exception(args)
const plugin = ReactGA.plugin
const set = ReactGA.set

ReactGA.initialize(propertyID)
ReactGA.set({ version: packageJson.version })
ReactGA.event({ category: 'Version', label: packageJson.version, action: 'report' })

const listener = location => {
  ReactGA.set({ page: location.pathname })
  ReactGA.pageview(location.pathname)
}

export default {
  listener,
  ga,
  set,
  pageview,
  modalview,
  event,
  timing,
  outboundLink,
  exception,
  plugin
}
