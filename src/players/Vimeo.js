import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'
import { canPlay } from '../patterns'

const SDK_URL = 'https://player.vimeo.com/api/player.js'
const SDK_GLOBAL = 'Vimeo'

const cleanUrl = url => {
  return url.replace('/manage/videos', '')
}

export default class Vimeo extends Component {
  static displayName = 'Vimeo'
  static canPlay = canPlay.vimeo
  static forceLoad = true // Prevent checking isLoading when URL changes
  callPlayer = callPlayer
  duration = null
  currentTime = null
  secondsLoaded = null

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  load (url) {
    this.duration = null
    getSDK(SDK_URL, SDK_GLOBAL).then(Vimeo => {
      if (!this.container) return
      const { playerOptions, title } = this.props.config
      this.player = new Vimeo.Player(this.container, {
        url: cleanUrl(url),
        autoplay: this.props.playing,
        muted: this.props.muted,
        loop: this.props.loop,
        playsinline: this.props.playsinline,
        controls: this.props.controls,
        ...playerOptions
      })
      this.player.ready().then(() => {
        const iframe = this.container.querySelector('iframe')
        iframe.style.width = '100%'
        iframe.style.height = '100%'
        if (title) {
          iframe.title = title
        }
      }).catch(this.props.onError)
      this.player.on('loaded', () => {
        this.props.onReady()
        this.refreshDuration()
      })
      this.player.on('play', () => {
        this.props.onPlay()
        this.refreshDuration()
      })
      this.player.on('pause', this.props.onPause)
      this.player.on('seeked', e => this.props.onSeek(e.seconds))
      this.player.on('ended', this.props.onEnded)
      this.player.on('error', this.props.onError)
      this.player.on('timeupdate', ({ seconds }) => {
        this.currentTime = seconds
      })
      this.player.on('progress', ({ seconds }) => {
        this.secondsLoaded = seconds
      })
      this.player.on('bufferstart', this.props.onBuffer)
      this.player.on('bufferend', this.props.onBufferEnd)
      this.player.on('playbackratechange', e => this.props.onPlaybackRateChange(e.playbackRate))
    }, this.props.onError)
  }

  refreshDuration () {
    this.player.getDuration().then(duration => {
      this.duration = duration
    })
  }

  play () {
    const promise = this.callPlayer('play')
    if (promise) {
      promise.catch(this.props.onError)
    }
  }

  pause () {
    this.callPlayer('pause')
  }

  stop () {
    this.callPlayer('unload')
  }

  seekTo (seconds, keepPlaying = true) {
    this.callPlayer('setCurrentTime', seconds)
    if (!keepPlaying) {
      this.pause()
    }
  }

  setVolume (fraction) {
    this.callPlayer('setVolume', fraction)
  }

  setMuted (muted) {
    this.callPlayer('setMuted', muted)
  }

  setLoop (loop) {
    this.callPlayer('setLoop', loop)
  }

  setPlaybackRate (rate) {
    this.callPlayer('setPlaybackRate', rate)
  }

  mute = () => {
    this.setMuted(true)
  }

  unmute = () => {
    this.setMuted(false)
  }

  getDuration () {
    return this.duration
  }

  getCurrentTime () {
    return this.currentTime
  }

  getSecondsLoaded () {
    return this.secondsLoaded
  }

  ref = container => {
    this.container = container
  }

  render () {
    const { display } = this.props
    const style = {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      display
    }
    return (
      <div
        key={this.props.url}
        ref={this.ref}
        style={style}
      />
    )
  }
}
