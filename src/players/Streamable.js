import React from 'react'

import Base from './Base'
import { getSDK } from '../utils'

const SDK_URL = '//cdn.embed.ly/player-0.0.12.min.js'
const SDK_GLOBAL = 'playerjs'
const MATCH_URL = /^https?:\/\/streamable.com\/([a-z0-9]+)$/

export default class Streamable extends Base {
  static displayName = 'Streamable'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  duration = null
  currentTime = null
  secondsLoaded = null
  load (url) {
    if (this.loadingSDK) {
      this.loadOnReady = url
      return
    }
    this.loadingSDK = true
    getSDK(SDK_URL, SDK_GLOBAL).then(playerjs => {
      this.player = new playerjs.Player(this.iframe)
      this.player.on('ready', this.onReady)
      this.player.on('play', this.onPlay)
      this.player.on('pause', this.props.onPause)
      this.player.on('seeked', this.props.onSeek)
      this.player.on('ended', this.props.onEnded)
      this.player.on('error', this.props.onError)
      this.player.on('timeupdate', ({ duration, seconds }) => {
        this.duration = duration
        this.currentTime = seconds
      })
      this.player.on('progress', ({ percent }) => {
        if (this.duration) {
          this.secondsLoaded = this.duration * percent
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
    // Nothing to do
  }
  seekTo (amount) {
    const seconds = super.seekTo(amount)
    this.callPlayer('setCurrentTime', seconds)
  }
  setVolume (fraction) {
    this.callPlayer('setVolume', fraction * 100)
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
    const id = this.props.url.match(MATCH_URL)[1]
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
