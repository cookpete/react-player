import React from 'react'

import Base from './Base'
import { getSDK, randomString } from '../utils'

const SDK_URL = '//player.twitch.tv/js/embed/v1.js'
const SDK_GLOBAL = 'Twitch'
const MATCH_VIDEO_URL = /^(?:https?:\/\/)?(?:www\.)twitch\.tv\/videos\/(\d+)($|\?)/
const MATCH_CHANNEL_URL = /^(?:https?:\/\/)?(?:www\.)twitch\.tv\/([a-z0-9_]+)($|\?)/
const PLAYER_ID_PREFIX = 'twitch-player-'

export default class Twitch extends Base {
  static displayName = 'Twitch'
  static canPlay (url) {
    return MATCH_VIDEO_URL.test(url) || MATCH_CHANNEL_URL.test(url)
  }
  playerID = PLAYER_ID_PREFIX + randomString()
  load (url) {
    const { playsinline, onError } = this.props
    const isChannel = MATCH_CHANNEL_URL.test(url)
    const id = isChannel ? url.match(MATCH_CHANNEL_URL)[1] : url.match(MATCH_VIDEO_URL)[1]
    if (this.isReady) {
      if (isChannel) {
        this.player.setChannel(id)
      } else {
        this.player.setVideo('v' + id)
      }
      return
    }
    if (this.loadingSDK) {
      this.loadOnReady = url
      return
    }
    this.loadingSDK = true
    getSDK(SDK_URL, SDK_GLOBAL).then(Twitch => {
      this.player = new Twitch.Player(this.playerID, {
        video: isChannel ? '' : id,
        channel: isChannel ? id : '',
        height: '100%',
        width: '100%',
        playsinline: playsinline
      })
      const { READY, PLAY, PAUSE, ENDED } = Twitch.Player
      this.player.addEventListener(READY, this.onReady)
      this.player.addEventListener(PLAY, this.onPlay)
      this.player.addEventListener(PAUSE, this.props.onPause)
      this.player.addEventListener(ENDED, this.onEnded)
    }, onError)
  }
  onEnded = () => {
    const { loop, onEnded } = this.props
    if (loop) {
      this.seekTo(0)
    }
    onEnded()
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
  seekTo (amount) {
    const seconds = super.seekTo(amount)
    this.callPlayer('seek', seconds)
  }
  setVolume (fraction) {
    this.callPlayer('setVolume', fraction)
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
