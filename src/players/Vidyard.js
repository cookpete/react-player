import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'
import { canPlay, MATCH_URL_VIDYARD } from '../patterns'

const SDK_URL = 'https://play.vidyard.com/embed/v4.js'
const SDK_GLOBAL = 'VidyardV4'
const SDK_GLOBAL_READY = 'onVidyardAPI'

export default class Vidyard extends Component {
  static displayName = 'Vidyard'
  static canPlay = canPlay.vidyard
  callPlayer = callPlayer

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  load (url) {
    const { playing, config, onError, onDuration } = this.props
    const id = url && url.match(MATCH_URL_VIDYARD)[1]
    if (this.player) {
      this.stop()
    }
    getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY).then(Vidyard => {
      if (!this.container) return
      Vidyard.api.addReadyListener((data, player) => {
        if (this.player) {
          return
        }
        this.player = player
        this.player.on('ready', this.props.onReady)
        this.player.on('play', this.props.onPlay)
        this.player.on('pause', this.props.onPause)
        this.player.on('seek', this.props.onSeek)
        this.player.on('playerComplete', this.props.onEnded)
      }, id)
      Vidyard.api.renderPlayer({
        uuid: id,
        container: this.container,
        autoplay: playing ? 1 : 0,
        ...config.options
      })
      Vidyard.api.getPlayerMetadata(id).then(meta => {
        this.duration = meta.length_in_seconds
        onDuration(meta.length_in_seconds)
      })
    }, onError)
  }

  play () {
    this.callPlayer('play')
  }

  pause () {
    this.callPlayer('pause')
  }

  stop () {
    window.VidyardV4.api.destroyPlayer(this.player)
  }

  seekTo (amount) {
    this.callPlayer('seek', amount)
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

  setPlaybackRate (rate) {
    this.callPlayer('setPlaybackSpeed', rate)
  }

  getDuration () {
    return this.duration
  }

  getCurrentTime () {
    return this.callPlayer('currentTime')
  }

  getSecondsLoaded () {
    return null
  }

  ref = container => {
    this.container = container
  }

  render () {
    const { display } = this.props
    const style = {
      width: '100%',
      height: '100%',
      display
    }
    return (
      <div style={style}>
        <div ref={this.ref} />
      </div>
    )
  }
}
