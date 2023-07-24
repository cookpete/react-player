import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'
import { canPlay, MATCH_URL_ASCIINEMA } from '../patterns'

const SDK_URL = 'http://localhost/asciinema-player.js'
const SDK_GLOBAL = 'AsciinemaPlayer'

export default class Asciinema extends Component {
  static displayName = 'Asciinema'
  static canPlay = canPlay.asciinema
  static loopOnEnded = true
  callPlayer = callPlayer

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
    if (this.props.url) {
      if (!this.props.id) {
        this.playerID = 'asciinema_player'
      } else {
        this.playerID = this.props.id
      }
    }
  }

  load (url) {
    getSDK(SDK_URL, SDK_GLOBAL).then(AsciinemaPlayer => {
      if (this.player) {
        return
      }
      this.player = AsciinemaPlayer.create(url, this.div)
      this.player.addEventListener('play', this.props.onReady)
      this.player.addEventListener('playing', this.props.onPlay)
      this.player.addEventListener('pause', this.props.onPause)
      this.player.addEventListener('ended', this.props.onEnded)
      this.player.addEventListener('seek', this.props.onSeek)
    })
  }

  play () {
    this.callPlayer('play')
  }

  pause () {
    this.callPlayer('pause')
  }

  stop () {
    this.callPlayer('pause')
  }

  seekTo (seconds) {
    this.callPlayer('seek', seconds)
  }

  setVolume (fraction) {
  }

  mute = () => {
  }

  unmute = () => {
  }

  getDuration () {
    return this.callPlayer('getDuration')
  }

  getCurrentTime () {
    return this.callPlayer('getCurrentTime')
  }

  getSecondsLoaded () {
    return null
  }

  ref = div => {
    this.div = div
  }

  render () {
    const style = {
      width: '73%',
      height: '100%'
    }
    return (
      <div style={style} ref={this.ref} id={this.playerID} />
    )
  }
}
