import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'
import { canPlay, MATCH_URL_ASCIINEMA } from '../patterns'

const SDK_URL = 'https://github.com/asciinema/asciinema-player/releases/download/v3.5.0/asciinema-player.min.js'
const SDK_GLOBAL = 'AsciinemaPlayer'

export default class Asciinema extends Component {
  static displayName = 'Asciinema'
  static canPlay = canPlay.asciinema
  static loopOnEnded = true
  callPlayer = callPlayer
  secondsLoaded = null

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
    if (this.props.url) {
      this.playerID = this.props.id ? this.props.id : this.props.url.match(MATCH_URL_ASCIINEMA)[1]
    }
  }

  load (url) {
    if (this.player) {
      // return
      this.stop()
    }

    getSDK(SDK_URL, SDK_GLOBAL).then(AsciinemaPlayer => {
      if (this.player) {
        return
      }

      if (!url.endsWith('.cast')) {
        url = url + '.cast'
      }

      const poster = this.props.poster ? this.props.poster : 'npt:00:10'
      const fit = this.props.fit ? this.props.fit : 'both'
      const fontSize = this.props.fontSize ? this.props.fontSize : 'small'
      const controls = this.props.controls ? this.props.controls : true

      this.player = AsciinemaPlayer.create(url, this.div, {
        loop: this.props.loop,
        fit: fit,
        poster: poster,
        startAt: this.props.startAt,
        terminalFontSize: fontSize,
        controls: controls
      })
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
  }

  seekTo (seconds) {
    this.callPlayer('seek', seconds)
  }

  setVolume (fraction) {
    console.log('Not supported')
  }

  mute = () => {
    console.log('Not supported')
  }

  unmute = () => {
    console.log('Not supported')
  }

  getDuration () {
    return this.callPlayer('getDuration')
  }

  getCurrentTime () {
    return this.callPlayer('getCurrentTime')
  }

  getSecondsLoaded () {
    return this.secondsLoaded
  }

  ref = div => {
    this.div = div
  }

  render () {
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
      <div style={style} ref={this.ref} id={this.playerID} />
    )
  }
}
