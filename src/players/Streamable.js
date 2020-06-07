import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'
import { canPlay, MATCH_URL_STREAMABLE } from '../patterns'

const SDK_URL = 'https://cdn.embed.ly/player-0.1.0.min.js'
const SDK_GLOBAL = 'playerjs'

export default class Streamable extends Component {
  static displayName = 'Streamable'
  static canPlay = canPlay.streamable
  callPlayer = callPlayer
  duration = null
  currentTime = null
  secondsLoaded = null

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  load (url) {
    getSDK(SDK_URL, SDK_GLOBAL).then(playerjs => {
      if (!this.iframe) return
      this.player = new playerjs.Player(this.iframe)
      this.player.setLoop(this.props.loop)
      this.player.on('ready', this.props.onReady)
      this.player.on('play', this.props.onPlay)
      this.player.on('pause', this.props.onPause)
      this.player.on('seeked', this.props.onSeek)
      this.player.on('ended', this.props.onEnded)
      this.player.on('error', this.props.onError)
      this.player.on('timeupdate', ({ duration, seconds }) => {
        this.duration = duration
        this.currentTime = seconds
      })
      this.player.on('buffered', ({ percent }) => {
        if (this.duration) {
          this.secondsLoaded = this.duration * percent
        }
      })
      if (this.props.muted) {
        this.player.mute()
      }
    }, this.props.onError)
  }

  play () {
    this.callPlayer('play')
  }

  pause () {
    this.callPlayer('pause')
  }

  stop () {
    // Nothing to do
  }

  seekTo (seconds) {
    this.callPlayer('setCurrentTime', seconds)
  }

  setVolume (fraction) {
    this.callPlayer('setVolume', fraction * 100)
  }

  setLoop (loop) {
    this.callPlayer('setLoop', loop)
  }

  mute = () => {
    this.callPlayer('mute')
  }

  unmute = () => {
    this.callPlayer('unmute')
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

  ref = iframe => {
    this.iframe = iframe
  }

  render () {
    const id = this.props.url.match(MATCH_URL_STREAMABLE)[1]
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
      <iframe
        ref={this.ref}
        src={`https://streamable.com/o/${id}`}
        frameBorder='0'
        scrolling='no'
        style={style}
        allowFullScreen
      />
    )
  }
}
