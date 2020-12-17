import React, { Component } from 'react'
import { canPlay, MATCH_URL_CINEMA8 } from '../patterns'
import { callPlayer, getSDK } from '../utils'

const SDK_URL = 'https://ivideo-streamx-io.akamaized.net/player/api/cinema8.player.api.min.js'
const SDK_GLOBAL = 'Cinema8Player'

export default class Cinema8 extends Component {
  static displayName = 'Cinema8'
  static canPlay = canPlay.cinema8
  static loopOnEnded = true
  callPlayer = callPlayer
  duration = null
  currentTime = null
  secondsLoaded = null

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  getID (url) {
    if (!url || url instanceof Array) {
      return null
    }
    return url.match(MATCH_URL_CINEMA8)[1]
  }

  load (url) {
    getSDK(SDK_URL, SDK_GLOBAL).then(Cinema8Player => {
      const id = this.getID(url)
      var that = this
      if (!this.container) return
      this.player = new Cinema8Player(this.container, {
        id: id,
        autoplay: this.props.playing,
        loop: this.props.loop,
        controls: this.props.controls,
        ...this.props.config.options,
        onready: () => {
          that.props.onReady()
          this.duration = that.player.duration()
        },
        onplay: () => {
          that.player.onplay = that.props.onPlay()
        },
        onpause: () => {
          that.player.onpause = that.props.onPause()
        },
        onprogress: () => {
          this.currentTime = that.player.currentTime()
        },
        onend: () => {
          that.player.onend = that.props.onEnded()
        }
      })
    }, this.props.onError)
  }

  play () {
    this.callPlayer('play')
  }

  pause () {
    this.callPlayer('pause')
  }

  stop () {
    this.callPlayer('unload')
  }

  seekTo (seconds) {
    this.callPlayer('currentTime', seconds)
  }

  setLoop (loop) {
    this.callPlayer('setLoop', loop)
  }

  setVolume (fraction) {
    this.callPlayer('volume', fraction)
  }

  mute = () => {
    this.setVolume(0)
  }

  unmute = () => {
    this.callPlayer('unmute')
  }

  setPlaybackRate (rate) {
    this.callPlayer('setPlaybackRate', rate)
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
