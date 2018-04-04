import React, { Component } from 'react'

import { callPlayer, getSDK, randomString } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = '//player.twitch.tv/js/embed/v1.js'
const SDK_GLOBAL = 'Twitch'
const MATCH_VIDEO_URL = /(?:www\.|go\.)?twitch\.tv\/videos\/(\d+)($|\?)/
const MATCH_CHANNEL_URL = /(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\?)/
const PLAYER_ID_PREFIX = 'twitch-player-'

export class Twitch extends Component {
  static displayName = 'Twitch'
  static canPlay = url => MATCH_VIDEO_URL.test(url) || MATCH_CHANNEL_URL.test(url)
  static isChannel = url => MATCH_CHANNEL_URL.test(url)
  static loopOnEnded = true

  callPlayer = callPlayer
  playerID = PLAYER_ID_PREFIX + randomString()
  load (url, isReady) {
    const { playsinline, onError, config } = this.props
    const isChannel = MATCH_CHANNEL_URL.test(url)
    const id = isChannel ? url.match(MATCH_CHANNEL_URL)[1] : url.match(MATCH_VIDEO_URL)[1]

    // hacks to fix seek logic on live players
    this.channelTime = 0
    this.pausedTime = 0
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
        ...config.twitch.options
      })
      const { READY, PLAY, PAUSE, ENDED } = Twitch.Player
      this.player.addEventListener(READY, this.props.onReady)
      this.player.addEventListener(PLAY, (args) => {
        if (isChannel) {
          this.channelTime = this.pausedTime
        }
        this.props.onPlay(args)
      })
      this.player.addEventListener(PAUSE, (args) => {
        if (isChannel) {
          this.pausedTime = this.getCurrentTime()
        }
        this.props.onPause(args)
      })
      this.player.addEventListener(ENDED, this.props.onEnded)
    }, onError)
  }
  play () {
    console.log('call play')
    this.callPlayer('play')
  }
  pause () {
    console.log('call pause')
    console.trace()
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
  getDuration () {
    // need this for offline mode too
    if (Twitch.isChannel(this.props.url)) {
      return Infinity
    }
    return this.callPlayer('getDuration')
  }
  getCurrentTime () {
    return this.channelTime + this.callPlayer('getCurrentTime')
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
