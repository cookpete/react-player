import React, { Component } from 'react'

import { callPlayer, getSDK, randomString } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = 'https://player.twitch.tv/js/embed/v1.js'
const SDK_GLOBAL = 'Twitch'
const MATCH_VIDEO_URL = /(?:www\.|go\.)?twitch\.tv\/videos\/(\d+)($|\?)/
const MATCH_CHANNEL_URL = /(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\?)/
const PLAYER_ID_PREFIX = 'twitch-player-'

export class Twitch extends Component {
  static displayName = 'Twitch'
  static canPlay = url => MATCH_VIDEO_URL.test(url) || MATCH_CHANNEL_URL.test(url)
  static loopOnEnded = true

  callPlayer = callPlayer
  playerID = PLAYER_ID_PREFIX + randomString()
  load (url, isReady) {
    const { playsinline, onError, config } = this.props
    const isChannel = MATCH_CHANNEL_URL.test(url)
    const id = isChannel ? url.match(MATCH_CHANNEL_URL)[1] : url.match(MATCH_VIDEO_URL)[1]
    if (isReady) {
      if (isChannel) {
        this.player.setChannel(id)
      } else {
        this.player.setVideo('v' + id)
      }
      return
    }
    getSDK(SDK_URL, SDK_GLOBAL).then(Twitch => {
      this.player = new Twitch.Player(this.playerID, {
        video: isChannel ? '' : id,
        channel: isChannel ? id : '',
        height: '100%',
        width: '100%',
        playsinline: playsinline,
        autoplay: this.props.playing,
        muted: this.props.muted,
        ...config.twitch.options
      })
      const { READY, PLAYING, PAUSE, ENDED } = Twitch.Player
      this.player.addEventListener(READY, this.props.onReady)
      this.player.addEventListener(PLAYING, this.props.onPlay)
      this.player.addEventListener(PAUSE, this.props.onPause)
      this.player.addEventListener(ENDED, this.props.onEnded)
    }, onError)
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
    this.callPlayer('setVolume', fraction)
  }
  mute = () => {
    this.callPlayer('setMuted', true)
  }
  unmute = () => {
    this.callPlayer('setMuted', false)
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
  render () {
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
      <div style={style} id={this.playerID} />
    )
  }
}

export default createSinglePlayer(Twitch)
