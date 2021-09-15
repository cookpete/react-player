import React, { Component } from 'react'
import { callPlayer, getSDK } from '../utils'
import { canPlay } from '../patterns'

const embed_spotify = (url) => url.replace("open.spotify.com/", "open.spotify.com/embed/")

export default class Spotify extends Component {
  static displayName = 'Spotify'
  static canPlay = canPlay.spotify
  static loopOnEnded = true
  callPlayer = callPlayer
  duration = null
  currentTime = null
  fractionLoaded = null

  componentDidMount() {
    this.props.onMount && this.props.onMount(this)
  }

  load(url, isReady) {
    // TODO: Implement spotify SDK, if they have one
  }

  play() {
    this.callPlayer('play')
  }

  pause() {
    this.callPlayer('pause')
  }

  stop() {
    // Nothing to do
  }

  seekTo(seconds) {
    this.callPlayer('seekTo', seconds * 1000)
  }

  setVolume(fraction) {
    this.callPlayer('setVolume', fraction * 100)
  }

  mute = () => {
    this.setVolume(0)
  }

  unmute = () => {
    if (this.props.volume !== null) {
      this.setVolume(this.props.volume)
    }
  }

  getDuration() {
    return this.duration
  }

  getCurrentTime() {
    return this.currentTime
  }

  getSecondsLoaded() {
    return this.fractionLoaded * this.duration
  }

  ref = iframe => {
    this.iframe = iframe
  }

  render() {
    const { display } = this.props
    const style = {
      width: '100%',
      height: '100%',
      display
    }
    return (
      <iframe
        ref={this.ref}
        src={embed_spotify(this.props.url)}
        style={style}
        frameBorder="0"
        allow='autoplay'
        allowtransparency="true"
        allow="encrypted-media" />
    )
  }
}

