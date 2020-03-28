import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'

const SDK_URL = 'https://fast.wistia.com/assets/external/E-v1.js'
const SDK_GLOBAL = 'Wistia'
const MATCH_URL = /(?:wistia\.com|wi\.st)\/(?:medias|embed)\/(.*)$/

export default class Wistia extends Component {
  static displayName = 'Wistia'
  static canPlay = url => MATCH_URL.test(url)
  static loopOnEnded = true

  callPlayer = callPlayer

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  getID (url) {
    return url && url.match(MATCH_URL)[1]
  }

  load (url) {
    const { playing, muted, controls, onReady, config, onError } = this.props
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
          this.player.bind('play', this.onPlay)
          this.player.bind('pause', this.onPause)
          this.player.bind('seek', this.onSeek)
          this.player.bind('end', this.onEnded)
          onReady()
        }
      })
    }, onError)
  }

  unbind () {
    this.player.unbind('play', this.onPlay)
    this.player.unbind('pause', this.onPause)
    this.player.unbind('seek', this.onSeek)
    this.player.unbind('end', this.onEnded)
  }

  // Proxy methods to prevent listener leaks
  onPlay = (...args) => this.props.onPlay(...args)
  onPause = (...args) => this.props.onPause(...args)
  onSeek = (...args) => this.props.onSeek(...args)
  onEnded = (...args) => this.props.onEnded(...args)

  play () {
    this.callPlayer('play')
  }

  pause () {
    this.callPlayer('pause')
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
