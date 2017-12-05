import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'

const SDK_URL = 'https://player.vimeo.com/api/player.js'
const SDK_GLOBAL = 'Vimeo'
const MATCH_URL = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:(?:channels|ondemand)\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/

export default class Vimeo extends Component {
  static displayName = 'Vimeo'
  static canPlay = url => MATCH_URL.test(url)

  callPlayer = callPlayer
  duration = null
  currentTime = null
  secondsLoaded = null
  load (url, isReady) {
    const id = url.match(MATCH_URL)[3]
    this.duration = null
    if (isReady) {
      this.player.loadVideo(id).catch(this.props.onError)
      return
    }
    getSDK(SDK_URL, SDK_GLOBAL).then(Vimeo => {
      if (!this.container) return
      this.player = new Vimeo.Player(this.container, {
        ...this.props.config.vimeo.playerOptions,
        url,
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
    const style = {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: 'black',
      ...this.props.style
    }
    return <div style={style} ref={this.ref} />
  }
}
