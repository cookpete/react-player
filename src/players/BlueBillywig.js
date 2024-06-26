import React, { Component } from 'react'

import { canPlay, MATCH_URL_BLUEBILLYWIG } from '../patterns'

const SDK_URL = 'https://cdn.bluebillywig.com/apps/player/latest/player.js'

export default class BlueBillywig extends Component {
  static displayName = 'BlueBillywig'
  static canPlay = canPlay.bluebillywig

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
    this.addListeners(this.player)
  }

  componentWillUnmount () {
    this.removeListeners(this.player)
  }

  addListeners (player) {
    player.addEventListener('canplay', this.onReady)
    player.addEventListener('play', this.onPlay)
    player.addEventListener('waiting', this.onBuffer)
    player.addEventListener('playing', this.onBufferEnd)
    player.addEventListener('pause', this.onPause)
    player.addEventListener('seeked', this.onSeek)
    player.addEventListener('ended', this.onEnded)
    player.addEventListener('error', this.onError)
    player.addEventListener('ratechange', this.onPlayBackRateChange)
  }

  removeListeners (player) {
    player.removeEventListener('canplay', this.onReady)
    player.removeEventListener('play', this.onPlay)
    player.removeEventListener('waiting', this.onBuffer)
    player.removeEventListener('playing', this.onBufferEnd)
    player.removeEventListener('pause', this.onPause)
    player.removeEventListener('seeked', this.onSeek)
    player.removeEventListener('ended', this.onEnded)
    player.removeEventListener('error', this.onError)
    player.removeEventListener('ratechange', this.onPlayBackRateChange)
  }

  // Proxy methods to prevent listener leaks
  onReady = (...args) => this.props.onReady(...args)
  onPlay = (...args) => this.props.onPlay(...args)
  onBuffer = (...args) => this.props.onBuffer(...args)
  onBufferEnd = (...args) => this.props.onBufferEnd(...args)
  onPause = (...args) => this.props.onPause(...args)
  onSeek = () => this.props.onSeek(this.player.api?.getCurrentTime())
  onEnded = (...args) => this.props.onEnded(...args)
  onError = (...args) => this.props.onError(...args)
  onPlayBackRateChange = () => this.props.onPlaybackRateChange(this.player.api?.getPlaybackRate())

  async load (url) {
    const { onLoaded, onError } = this.props

    if (!globalThis.customElements?.get('bb-main-player')) {
      try {
        await import(/* webpackIgnore: true */ `${SDK_URL}`)
        onLoaded()
      } catch (error) {
        onError(error)
      }
    }

    this.player.setAttribute('jsonEmbedUrl', url)
  }

  onDurationChange = () => {
    const duration = this.getDuration()
    this.props.onDuration(duration)
  }

  play () {
    if (!this.player) return
    this.player.api?.play(true) // assumes user action
  }

  pause () {
    if (!this.player) return
    this.player.api?.pause(true) // assumes user action
  }

  stop () {
    if (!this.player) return
    this.player.api?.load(null)
  }

  seekTo (seconds, keepPlaying = true) {
    if (!this.player) return
    this.player.api?.seek(seconds)
    if (!keepPlaying) {
      this.pause()
    }
  }

  setVolume (fraction) {
    if (!this.player) return
    this.player.api?.setVolume(fraction)
  }

  mute = () => {
    if (!this.player) return
    this.player.api?.setMuted(true, true, true) // assumes user action
  }

  unmute = () => {
    if (!this.player) return
    this.player.api?.setMuted(false, true, true) // assumes user action
  }

  enablePIP () {
    if (!this.player) return
    if (this.player.requestPictureInPicture && document.pictureInPictureElement !== this.player) {
      this.player.requestPictureInPicture()
    }
  }

  disablePIP () {
    if (document.exitPictureInPicture && document.pictureInPictureElement === this.player) {
      document.exitPictureInPicture()
    }
  }

  setPlaybackRate (rate) {
    if (!this.player) return
    try {
      this.player.api?.setPlaybackRate(rate)
    } catch (error) {
      this.props.onError(error)
    }
  }

  getDuration () {
    if (!this.player) return null
    return this.player.api?.getDuration() || 0
  }

  getCurrentTime () {
    if (!this.player) return null
    return this.player.api?.getCurrentTime() || 0
  }

  getSecondsLoaded () {
    if (!this.player) return null
    const buffered = this.player.api?.getBuffered()
    if (!buffered || !buffered.end) {
      return 0
    }
    const end = buffered.end[buffered.end.length - 1]
    const duration = this.getDuration()
    if (end > duration) {
      return duration
    }

    return end
  }

  getPlaybackId (url) {
    const [appId, contentIndicator, contentId] = url.match(MATCH_URL_BLUEBILLYWIG)
    return contentId
  }

  ref = player => {
    this.player = player
  }

  render () {
    const { url, playing, loop, controls, muted, width, height } = this.props
    const style = {
      width: width === 'auto' ? width : '100%',
      height: height === 'auto' ? height : '100%'
    }

    this.overrides = this.overrides || ''
    if (url !== this.url || loop !== this.loop || controls !== this.controls) {
      this.url = url
      this.loop = loop
      this.controls = controls
      const controlBar = controls ? 'Autohide' : 'Hide'
      this.overrides = JSON.stringify({ autoPlay:`${playing}`, autoMute:`${muted}`, autoLoop:`${loop}`, controlBar })
    }
    return (
      <bb-main-player
        ref={this.ref}
        overrides={this.overrides}
        jsonEmbedUrl={url}
        style={style}
      ></bb-main-player>
    )
  }
}
