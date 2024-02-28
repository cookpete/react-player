import React, { Component } from 'react'

import { canPlay, MATCH_URL_MUX } from '../patterns'

const SDK_URL = 'https://cdn.jsdelivr.net/npm/@mux/mux-player@2/dist/mux-player.mjs'

export default class Mux extends Component {
  static displayName = 'Mux'
  static canPlay = canPlay.mux

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
    this.addListeners(this.player)
    const playbackId = this.getPlaybackId(this.props.url) // Ensure src is set in strict mode
    if (playbackId) {
      this.player.playbackId = playbackId
    }
  }

  componentWillUnmount () {
    this.player.playbackId = null
    this.removeListeners(this.player)
  }

  addListeners (player) {
    const { playsinline } = this.props
    player.addEventListener('play', this.onPlay)
    player.addEventListener('waiting', this.onBuffer)
    player.addEventListener('playing', this.onBufferEnd)
    player.addEventListener('pause', this.onPause)
    player.addEventListener('seeked', this.onSeek)
    player.addEventListener('ended', this.onEnded)
    player.addEventListener('error', this.onError)
    player.addEventListener('ratechange', this.onPlayBackRateChange)
    player.addEventListener('enterpictureinpicture', this.onEnablePIP)
    player.addEventListener('leavepictureinpicture', this.onDisablePIP)
    player.addEventListener('webkitpresentationmodechanged', this.onPresentationModeChange)
    player.addEventListener('canplay', this.onReady)
    if (playsinline) {
      player.setAttribute('playsinline', '')
    }
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
    player.removeEventListener('enterpictureinpicture', this.onEnablePIP)
    player.removeEventListener('leavepictureinpicture', this.onDisablePIP)
    player.removeEventListener('canplay', this.onReady)
  }

  // Proxy methods to prevent listener leaks
  onReady = (...args) => this.props.onReady(...args)
  onPlay = (...args) => this.props.onPlay(...args)
  onBuffer = (...args) => this.props.onBuffer(...args)
  onBufferEnd = (...args) => this.props.onBufferEnd(...args)
  onPause = (...args) => this.props.onPause(...args)
  onEnded = (...args) => this.props.onEnded(...args)
  onError = (...args) => this.props.onError(...args)
  onPlayBackRateChange = (event) => this.props.onPlaybackRateChange(event.target.playbackRate)
  onEnablePIP = (...args) => this.props.onEnablePIP(...args)

  onSeek = e => {
    this.props.onSeek(e.target.currentTime)
  }

  async load (url) {
    const { onError } = this.props

    if (!globalThis.customElements?.get('mux-player')) {
      try {
        await import(SDK_URL)
        this.props.onLoaded()
      } catch (error) {
        onError(error)
      }
    }

    const [, id] = url.match(MATCH_URL_MUX)
    this.player.playbackId = id
  }

  onDurationChange = () => {
    const duration = this.getDuration()
    this.props.onDuration(duration)
  }

  play () {
    const promise = this.player.play()
    if (promise) {
      promise.catch(this.props.onError)
    }
  }

  pause () {
    this.player.pause()
  }

  stop () {
    this.player.playbackId = null
  }

  seekTo (seconds, keepPlaying = true) {
    this.player.currentTime = seconds
    if (!keepPlaying) {
      this.pause()
    }
  }

  setVolume (fraction) {
    this.player.volume = fraction
  }

  mute = () => {
    this.player.muted = true
  }

  unmute = () => {
    this.player.muted = false
  }

  enablePIP () {
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
    try {
      this.player.playbackRate = rate
    } catch (error) {
      this.props.onError(error)
    }
  }

  getDuration () {
    if (!this.player) return null
    const { duration, seekable } = this.player
    // on iOS, live streams return Infinity for the duration
    // so instead we use the end of the seekable timerange
    if (duration === Infinity && seekable.length > 0) {
      return seekable.end(seekable.length - 1)
    }
    return duration
  }

  getCurrentTime () {
    if (!this.player) return null
    return this.player.currentTime
  }

  getSecondsLoaded () {
    if (!this.player) return null
    const { buffered } = this.player
    if (buffered.length === 0) {
      return 0
    }
    const end = buffered.end(buffered.length - 1)
    const duration = this.getDuration()
    if (end > duration) {
      return duration
    }
    return end
  }

  getPlaybackId (url) {
    const [, id] = url.match(MATCH_URL_MUX)
    return id
  }

  ref = player => {
    this.player = player
  }

  render () {
    const { url, playing, loop, controls, muted, config, width, height } = this.props
    const style = {
      width: width === 'auto' ? width : '100%',
      height: height === 'auto' ? height : '100%'
    }
    if (controls === false) {
      style['--controls'] = 'none'
    }
    return (
      <mux-player
        ref={this.ref}
        playback-id={this.getPlaybackId(url)}
        style={style}
        preload='auto'
        autoPlay={playing || undefined}
        muted={muted ? '' : undefined}
        loop={loop ? '' : undefined}
        {...config.attributes}
      />
    )
  }
}
