import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = '//fast.wistia.com/assets/external/E-v1.js'
const SDK_GLOBAL = 'Wistia'
const MATCH_URL = /(?:wistia\.com|wi\.st)\/(?:medias|embed)\/(.*)$/

export class Wistia extends Component {
  static displayName = 'Wistia'
  static canPlay = url => MATCH_URL.test(url)
  static loopOnEnded = true

  callPlayer = callPlayer
  getID (url) {
    return url && url.match(MATCH_URL)[1]
  }
  load (url) {
    const { playing, muted, controls, onReady, onPlay, onPause, onSeek, onEnded, config, onError } = this.props
    getSDK(SDK_URL, SDK_GLOBAL).then(() => {
      window._wq = window._wq || []
      window._wq.push({
        id: this.getID(url),
        options: {
          autoPlay: playing,
          silentAutoPlay: 'allow',
          muted: muted,
          controlsVisibleOnLoad: controls,
          ...config.wistia.options
        },
        onReady: player => {
          this.player = player
          this.unbind()
          this.player.bind('play', onPlay)
          this.player.bind('pause', onPause)
          this.player.bind('seek', onSeek)
          this.player.bind('end', onEnded)
          onReady()
        }
      })
    }, onError)
  }
  play () {
    this.callPlayer('play')
  }
  pause () {
    this.callPlayer('pause')
  }
  unbind () {
    const { onPlay, onPause, onSeek, onEnded } = this.props
    this.player.unbind('play', onPlay)
    this.player.unbind('pause', onPause)
    this.player.unbind('seek', onSeek)
    this.player.unbind('end', onEnded)
  }
  stop () {
    this.unbind()
    this.callPlayer('remove')
  }
  seekTo (seconds) {
    this.callPlayer('time', seconds)
  }
  setVolume (fraction) {
    this.callPlayer('volume', fraction)
  }
  mute = () => {
    this.callPlayer('mute')
  }
  unmute = () => {
    this.callPlayer('unmute')
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

export default createSinglePlayer(Wistia)
