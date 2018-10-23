import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = 'https://player.vimeo.com/api/player.js'
const SDK_GLOBAL = 'Vimeo'
const MATCH_URL = /vimeo\.com\/.+/
const MATCH_FILE_URL = /vimeo\.com\/external\/.+\.mp4/

export class Vimeo extends Component {
  static displayName = 'Vimeo'
  static canPlay = url => {
    if (MATCH_FILE_URL.test(url)) {
      return false
    }
    return MATCH_URL.test(url)
  }
  static canEnablePiP = url => false

  callPlayer = callPlayer
  duration = null
  currentTime = null
  secondsLoaded = null
  load (url) {
    this.duration = null
    getSDK(SDK_URL, SDK_GLOBAL).then(Vimeo => {
      if (!this.container) return
      this.player = new Vimeo.Player(this.container, {
        ...this.props.config.vimeo.playerOptions,
        url,
        autoplay: this.props.playing,
        muted: this.props.muted,
        loop: this.props.loop
      })
      this.player.ready().then(() => {
        const iframe = this.container.querySelector('iframe')
        iframe.style.width = '100%'
        iframe.style.height = '100%'
      }).catch(this.props.onError)
      this.player.on('loaded', () => {
        this.props.onReady()
        this.player.getDuration().then(duration => {
          this.duration = duration
        })
      })
      this.player.on('play', this.props.onPlay)
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
    this.callPlayer('setCurrentTime', seconds)
  }
  setVolume (fraction) {
    this.callPlayer('setVolume', fraction)
  }
  mute = () => {
    this.setVolume(0)
  }
  unmute = () => {
    if (this.props.volume !== null) {
      this.setVolume(this.props.volume)
    }
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
  pictureInPictureEnable () {}
  pictureInPictureDisable () {}
  render () {
    const style = {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: 'black',
      ...this.props.style
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

export default createSinglePlayer(Vimeo)
