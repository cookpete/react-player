import React, { Component } from 'react'

import { callPlayer, getSDK, randomString } from '../utils'
import { canPlay, MATCH_URL_WISTIA } from '../patterns'

const SDK_URL = 'https://fast.wistia.com/assets/external/E-v1.js'
const SDK_GLOBAL = 'Wistia'
const PLAYER_ID_PREFIX = 'wistia-player-'

export default class Wistia extends Component {
  static displayName = 'Wistia'
  static canPlay = canPlay.wistia
  static loopOnEnded = true
  callPlayer = callPlayer
  playerID = this.props.config.playerId || `${PLAYER_ID_PREFIX}${randomString()}`

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  load (url) {
    const { playing, muted, controls, onReady, config, onError } = this.props
    getSDK(SDK_URL, SDK_GLOBAL).then(Wistia => {
      if (config.customControls) {
        config.customControls.forEach(control => Wistia.defineControl(control))
      }
      window._wq = window._wq || []
      window._wq.push({
        id: this.playerID,
        options: {
          autoPlay: playing,
          silentAutoPlay: 'allow',
          muted: muted,
          controlsVisibleOnLoad: controls,
          fullscreenButton: controls,
          playbar: controls,
          playbackRateControl: controls,
          qualityControl: controls,
          volumeControl: controls,
          settingsControl: controls,
          smallPlayButton: controls,
          ...config.options
        },
        onReady: player => {
          this.player = player
          this.unbind()
          this.player.bind('play', this.onPlay)
          this.player.bind('pause', this.onPause)
          this.player.bind('seek', this.onSeek)
          this.player.bind('end', this.onEnded)
          this.player.bind('playbackratechange', this.onPlaybackRateChange)
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
    this.player.unbind('playbackratechange', this.onPlaybackRateChange)
  }

  // Proxy methods to prevent listener leaks
  onPlay = (...args) => this.props.onPlay(...args)
  onPause = (...args) => this.props.onPause(...args)
  onSeek = (...args) => this.props.onSeek(...args)
  onEnded = (...args) => this.props.onEnded(...args)
  onPlaybackRateChange = (...args) => this.props.onPlaybackRateChange(...args)

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
    const { url } = this.props
    const videoID = url && url.match(MATCH_URL_WISTIA)[1]
    const className = `wistia_embed wistia_async_${videoID}`
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
      <div id={this.playerID} key={videoID} className={className} style={style} />
    )
  }
}
