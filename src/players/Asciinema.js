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
        this.playerID = this.props.url.match(MATCH_URL_ASCIINEMA)[1]
      } else {
        this.playerID = this.props.id
      }
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

      this.player = AsciinemaPlayer.create(url, this.div, {
        loop: this.props.loop
        // theme: 'solarized-dark'
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
