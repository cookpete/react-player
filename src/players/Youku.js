import React, { Component } from 'react'

import { callPlayer, getSDK, randomString } from '../utils'
import { canPlay, MATCH_URL_YOUKU } from '../patterns'

const SDK_URL = 'https://player.youku.com/jsapi'
const SDK_GLOBAL = 'YKU'
const PLAYER_ID_PREFIX = 'youku-player-'

export default class Youku extends Component {
  static displayName = 'Youku'
  static canPlay = canPlay.youku
  callPlayer = callPlayer
  playerId = this.props.config.playerId || `${PLAYER_ID_PREFIX}${randomString()}`

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  load (url, isReady) {
    const { playing, config: { clientId, options }, onError } = this.props
    const id = url.match(MATCH_URL_YOUKU)[1]
    getSDK(SDK_URL, SDK_GLOBAL).then(YKU => {
      this.player = new YKU.Player(this.playerId, {
        client_id: clientId,
        vid: id,
        newPlayer: true,
        autoplay: playing,
        events: {
          onPlayerReady: () => this.props.onReady(),
          onPlayStart: () => this.props.onPlay(),
          onPlayEnd: () => this.props.onEnded()
        },
        ...options
      })
    }, onError)
  }

  play () {
    this.callPlayer('playVideo')
  }

  pause () {
    this.callPlayer('pauseVideo')
  }

  stop () {
    // Nothing to do
  }

  seekTo (amount) {
    this.callPlayer('seekTo', amount)
  }

  setVolume () {
    // No volume support
  }

  mute = () => {
    // No volume support
  }

  unmute = () => {
    // No volume support
  }

  getDuration () {
    return null
  }

  getCurrentTime () {
    return this.callPlayer('currentTime')
  }

  getSecondsLoaded () {
    return null
  }

  render () {
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
      <div id={this.playerId} style={style} />
    )
  }
}
