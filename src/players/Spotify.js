import React, { Component } from 'react'

import { callPlayer } from '../utils'
import createSinglePlayer from '../singlePlayer'

const MATCH_URL = /(?:spotify\.com)\/([a-z0-9]+)\/([A-z0-9]+)/

export class Spotify extends Component {
  static displayName = 'Spotify'
  static canPlay = url => MATCH_URL.test(url)
  static loopOnEnded = true

  callPlayer = callPlayer
  duration = null
  currentTime = null
  fractionLoaded = null
  load (url, isReady) {
    // Nothing to do
  }

  play () {
    // Nothing to do
  }

  pause () {
    // Nothing to do
  }

  stop () {
    // Nothing to do
  }

  seekTo (seconds) {
    // Nothing to do
  }

  setVolume (fraction) {
    // Nothing to do
  }

  mute = () => {
    // Nothing to do
  }

  unmute = () => {
    // Nothing to do
  }

  getDuration () {
    return this.duration
  }

  getCurrentTime () {
    return this.currentTime
  }

  getSecondsLoaded () {
    return this.fractionLoaded * this.duration
  }

  ref = iframe => {
    this.iframe = iframe
  }

  render () {
    const [, kind, id] = this.props.url.match(MATCH_URL)
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
      <iframe
        ref={this.ref}
        src={`https://open.spotify.com/embed/${kind}/${id}`}
        style={style}
        frameBorder={0}
        allowtransparency='true'
        allow='encrypted-media'
      />
    )
  }
}

export default createSinglePlayer(Spotify)
