import merge from 'lodash.merge'

import { DEPRECATED_CONFIG_PROPS } from './props'

const MATCH_START_QUERY = /[?&#](?:start|t)=([0-9hms]+)/
const MATCH_START_STAMP = /(\d+)(h|m|s)/g
const MATCH_NUMERIC = /^\d+$/

// Parse YouTube URL for a start time param, ie ?t=1h14m30s
// and return the start time in seconds
export function parseStartTime (url) {
  const match = url.match(MATCH_START_QUERY)
  if (match) {
    const stamp = match[1]
    if (stamp.match(MATCH_START_STAMP)) {
      return parseStartStamp(stamp)
    }
    if (MATCH_NUMERIC.test(stamp)) {
      return parseInt(stamp, 10)
    }
  }
  return 0
}

function parseStartStamp (stamp) {
  let seconds = 0
  let array = MATCH_START_STAMP.exec(stamp)
  while (array !== null) {
    const [, count, period] = array
    if (period === 'h') seconds += parseInt(count, 10) * 60 * 60
    if (period === 'm') seconds += parseInt(count, 10) * 60
    if (period === 's') seconds += parseInt(count, 10)
    array = MATCH_START_STAMP.exec(stamp)
  }
  return seconds
}

export function getConfig (props, defaultProps, showWarning) {
  const config = merge({}, defaultProps.config, props.config)
  for (let p of DEPRECATED_CONFIG_PROPS) {
    if (props[p]) {
      const key = p.replace(/Config$/, '')
      merge(config, { [key]: props[p] })
      if (showWarning) {
        const link = 'https://github.com/CookPete/react-player#config-prop'
        const message = `ReactPlayer: %c${p} %cis deprecated, please use the config prop instead – ${link}`
        console.warn(message, 'font-weight: bold', '')
      }
    }
  }
  return config
}
