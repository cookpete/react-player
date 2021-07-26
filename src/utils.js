import loadScript from 'load-script'
import merge from 'deepmerge'

const MATCH_START_QUERY = /[?&#](?:start|t)=([0-9hms]+)/
const MATCH_END_QUERY = /[?&#]end=([0-9hms]+)/
const MATCH_START_STAMP = /(\d+)(h|m|s)/g
const MATCH_NUMERIC = /^\d+$/

// Parse YouTube URL for a start time param, ie ?t=1h14m30s
// and return the start time in seconds
function parseTimeParam (url, pattern) {
  if (url instanceof Array) {
    return undefined
  }
  const match = url.match(pattern)
  if (match) {
    const stamp = match[1]
    if (stamp.match(MATCH_START_STAMP)) {
      return parseTimeString(stamp)
    }
    if (MATCH_NUMERIC.test(stamp)) {
      return parseInt(stamp)
    }
  }
  return undefined
}

function parseTimeString (stamp) {
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

export function parseStartTime (url) {
  return parseTimeParam(url, MATCH_START_QUERY)
}

export function parseEndTime (url) {
  return parseTimeParam(url, MATCH_END_QUERY)
}

// http://stackoverflow.com/a/38622545
export function randomString () {
  return Math.random().toString(36).substr(2, 5)
}

export function queryString (object) {
  return Object
    .keys(object)
    .map(key => `${key}=${object[key]}`)
    .join('&')
}

function getGlobal (key) {
  if (window[key]) {
    return window[key]
  }
  if (window.exports && window.exports[key]) {
    return window.exports[key]
  }
  if (window.module && window.module.exports && window.module.exports[key]) {
    return window.module.exports[key]
  }
  return null
}

// Util function to load an external SDK
// or return the SDK if it is already loaded
const requests = {}
export function getSDK (url, sdkGlobal, sdkReady = null, isLoaded = () => true, fetchScript = loadScript) {
  const existingGlobal = getGlobal(sdkGlobal)
  if (existingGlobal && isLoaded(existingGlobal)) {
    return Promise.resolve(existingGlobal)
  }
  return new Promise((resolve, reject) => {
    // If we are already loading the SDK, add the resolve and reject
    // functions to the existing array of requests
    if (requests[url]) {
      requests[url].push({ resolve, reject })
      return
    }
    requests[url] = [{ resolve, reject }]
    const onLoaded = sdk => {
      // When loaded, resolve all pending request promises
      requests[url].forEach(request => request.resolve(sdk))
    }
    if (sdkReady) {
      const previousOnReady = window[sdkReady]
      window[sdkReady] = function () {
        if (previousOnReady) previousOnReady()
        onLoaded(getGlobal(sdkGlobal))
      }
    }
    fetchScript(url, err => {
      if (err) {
        // Loading the SDK failed – reject all requests and
        // reset the array of requests for this SDK
        requests[url].forEach(request => request.reject(err))
        requests[url] = null
      } else if (!sdkReady) {
        onLoaded(getGlobal(sdkGlobal))
      }
    })
  })
}

export function getConfig (props, defaultProps) {
  return merge(defaultProps.config, props.config)
}

export function omit (object, ...arrays) {
  const omitKeys = [].concat(...arrays)
  const output = {}
  const keys = Object.keys(object)
  for (const key of keys) {
    if (omitKeys.indexOf(key) === -1) {
      output[key] = object[key]
    }
  }
  return output
}

export function callPlayer (method, ...args) {
  // Util method for calling a method on this.player
  // but guard against errors and console.warn instead
  if (!this.player || !this.player[method]) {
    let message = `ReactPlayer: ${this.constructor.displayName} player could not call %c${method}%c – `
    if (!this.player) {
      message += 'The player was not available'
    } else if (!this.player[method]) {
      message += 'The method was not available'
    }
    console.warn(message, 'font-weight: bold', '')
    return null
  }
  return this.player[method](...args)
}

export function isMediaStream (url) {
  return (
    typeof window !== 'undefined' &&
    typeof window.MediaStream !== 'undefined' &&
    url instanceof window.MediaStream
  )
}

export function isBlobUrl (url) {
  return /^blob:/.test(url)
}

export function supportsWebKitPresentationMode (video = document.createElement('video')) {
  // Check if Safari supports PiP, and is not on mobile (other than iPad)
  // iPhone safari appears to "support" PiP through the check, however PiP does not function
  const notMobile = /iPhone|iPod/.test(navigator.userAgent) === false
  return video.webkitSupportsPresentationMode && typeof video.webkitSetPresentationMode === 'function' && notMobile
}
