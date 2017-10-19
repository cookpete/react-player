import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'

const SDK_URL = '//fast.wistia.com/assets/external/E-v1.js'
const SDK_GLOBAL = 'Wistia'
const MATCH_URL = /^https?:\/\/(.+)?(wistia.com|wi.st)\/(medias|embed)\/(.*)$/

export default class Wistia extends Component {
  static displayName = 'Wistia'
  static canPlay = url => MATCH_URL.test(url)
  static loopOnEnded = true

  callPlayer = callPlayer
  getID (url) {
    return url && url.match(MATCH_URL)[4]
  }
  load (url) {
    const { controls, onReady, onPlay, onPause, onSeek, onEnded, config } = this.props
    getSDK(SDK_URL, SDK_GLOBAL).then(() => {
      window._wq = window._wq || []
      window._wq.push({
        id: this.getID(url),
        options: {
          controlsVisibleOnLoad: controls,
          ...config.wistia.options
        },
        onReady: player => {
          this.player = player
          this.player.bind('play', onPlay)
          this.player.bind('pause', onPause)
          this.player.bind('seek', onSeek)
          this.player.bind('end', onEnded)
          onReady()
        }
      })
    })
  }
  play () {
    this.callPlayer('play')
  }
  pause () {
    this.callPlayer('pause')
  }
  stop () {
    this.callPlayer('remove')
  }
  seekTo (seconds) {
    this.callPlayer('time', seconds)
  }
  setVolume (fraction) {
    this.callPlayer('volume', fraction)
  }
  setPlaybackRate (rate) {
    this.callPlayer('playbackRate', rate)
  }
  getDuration () {
    return this.callPlayer('duration')
  }
  getCurrentTime () {
    return this.callPlayer('time')
  }
  getSecondsLoaded () {
    return null
  }
  render () {
    const id = this.getID(this.props.url)
    const className = `wistia_embed wistia_async_${id}`
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
      <div key={id} className={className} style={style} />
    )
  }
}
