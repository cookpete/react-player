import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'
import { canPlay } from '../patterns'

const SDK_URL = 'http://localhost:8082/js/api.js'
const SDK_GLOBAL = 'Audius'

export default class Audius extends Component {
  static displayName = 'Audius'
  static canPlay = canPlay.audius
  static loopOnEnded = false
  callPlayer = callPlayer
  duration = 0
  currentTime = null
  fractionLoaded = null

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  load (url, isReady) {
    getSDK(SDK_URL, SDK_GLOBAL).then(Audius => {
      if (!this.iframe) return
      const { PLAY, PLAY_PROGRESS, PAUSE, FINISH, ERROR, READY } = Audius.Events
      if (!isReady) {
        this.player = Audius.Embed(this.iframe)
        this.player.bind(READY, () => {
          this.duration = this.player.state.duration
        })
        this.player.bind(PLAY, this.props.onPlay)
        this.player.bind(PAUSE, () => {
          const remaining = this.duration - this.currentTime
          if (remaining < 0.05) {
            return
          }
          this.props.onPause()
        })
        this.player.bind(PLAY_PROGRESS, () => {
          this.currentTime = this.player.state.position
          this.duration = this.player.state.duration
          this.fractionLoaded = 1
        })
        this.player.bind(FINISH, () => this.props.onEnded())
        this.player.bind(ERROR, () => this.props.onError())
        this.props.onReady()
      }
    })
  }

  play () {
    this.callPlayer('togglePlay')
  }

  pause () {
    this.callPlayer('togglePlay')
  }

  stop () {
    // Nothing to do
  }

  seekTo (seconds) {
    this.callPlayer('seekTo', seconds)
  }

  setVolume (fraction) {
    this.callPlayer('setVolume', fraction * 100)
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
    return this.fractionLoaded * this.duration
  }

  ref = iframe => {
    this.iframe = iframe
  }

  render () {
    const { display } = this.props
    const style = {
      width: '100%',
      height: '100%',
      display
    }
    return (
      <iframe
        ref={this.ref}
        src={this.props.url}
        style={style}
        frameBorder={0}
        width="100%"
        allow='encrypted-media'
      />
    )
  }
}
