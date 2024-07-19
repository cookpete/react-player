import React, { Component } from 'react'
import { getSDK, callPlayer } from '../utils'
import { canPlay } from '../patterns'

const SDK_URL = 'https://open.spotify.com/embed/iframe-api/v1'
const SDK_GLOBAL = 'SpotifyIframeApi'
const SDK_GLOBAL_READY = 'SpotifyIframeApi'

export default class Spotify extends Component {
  static displayName = 'Spotify'
  static loopOnEnded = true
  static canPlay = canPlay.spotify
  callPlayer = callPlayer
  duration = null
  currentTime = null
  totalTime = null
  player = null

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  load (url) {
    const isValidSdk = window[SDK_GLOBAL] && !this.player && window[SDK_GLOBAL].createController && typeof window[SDK_GLOBAL].createController === 'function'
    if (isValidSdk) {
      this.initializePlayer(window[SDK_GLOBAL], url)
      return
    } else if (this.player) {
      this.callPlayer('loadUri', this.props.url)
      return
    }

    window.onSpotifyIframeApiReady = (IFrameAPI) => this.initializePlayer(IFrameAPI, url)
    getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY)
  }

  initializePlayer = (IFrameAPI, url) => {
    if (!this.container) return

    const options = {
      width: '100%',
      height: '100%',
      uri: url
    }
    const callback = (EmbedController) => {
      this.player = EmbedController
      this.player.addListener('playback_update', this.onStateChange)
      this.player.addListener('ready', this.props.onReady)
    }
    IFrameAPI.createController(this.container, options, callback)
  }

  onStateChange = (event) => {
    const { data } = event
    const { onPlay, onPause, onBuffer, onBufferEnd, onEnded } = this.props

    if (data.position >= data.duration && data.position && data.duration) {
      onEnded()
    }
    if (data.isPaused === true) onPause()
    if (data.isPaused === false && data.isBuffering === false) {
      this.currentTime = data.position
      this.totalTime = data.duration
      onPlay()
      onBufferEnd()
    }
    if (data.isBuffering === true) onBuffer()
  }

  play () {
    this.callPlayer('resume')
  }

  pause () {
    this.callPlayer('pause')
  }

  stop () {
    this.callPlayer('destroy')
  }

  seekTo (amount) {
    this.callPlayer('seek', amount)
    if (!this.props.playing) {
      this.pause()
    } else {
      this.play()
    }
  }

  setVolume (fraction) {
    // No volume support
  }

  mute () {
    // No volume support
  }

  unmute () {
    // No volume support
  }

  setPlaybackRate (rate) {
    // No playback rate support
  }

  setLoop (loop) {
    // No loop support
  }

  getDuration () {
    return this.totalTime / 1000
  }

  getCurrentTime () {
    return this.currentTime / 1000
  }

  getSecondsLoaded () {
    // No seconds loaded support
  }

  ref = container => {
    this.container = container
  }

  render () {
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
      <div style={style}>
        <div ref={this.ref} />
      </div>
    )
  }
}
