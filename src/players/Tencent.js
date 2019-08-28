import React, { Component } from 'react'

import { callPlayer, getSDK, randomString } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = '//vm.gtimg.cn/tencentvideo/txp/js/txplayer.js'
const SDK_GLOBAL = 'Tencent'
const MATCH_VIDEO_URL = /v\.qq\.com\/x\/page\/([0-9a-z]+)/
const MATCH_LIST_URL = /v\.qq\.com\/x\/cover\/[0-9a-z]+\/([0-9a-z]+)/
const PLAYER_ID_PREFIX = 'tencent-player-'

export class Tencent extends Component {
  static displayName = 'Tencent'
  static canPlay = url => MATCH_VIDEO_URL.test(url) || MATCH_LIST_URL.test(url)
  static loopOnEnded = true

  callPlayer = callPlayer
  playerID = PLAYER_ID_PREFIX + randomString()
  load (url, isReady) {
    const { playsinline, onError, config } = this.props
    const isList = MATCH_LIST_URL.test(url)
    const id = isList ? url.match(MATCH_LIST_URL)[1] : url.match(MATCH_VIDEO_URL)[1]
    if (isReady) {
      this.callPlayer('play', {vid: id})
      this.props.onPlay()
      return
    }
    getSDK(SDK_URL, SDK_GLOBAL).then((Tencent) => {
      // Mount the player on `window.Tencent`.
      if (Tencent) {
        this.props.onReady()
      } else {
        window.Tencent = {
          Txplayer: Txplayer
        }
        Tencent = window.Tencent
      }
      this.player = new Tencent.Txplayer({
        containerId: this.playerID,
        vid: id,
        height: '100%',
        width: '100%',
        playsinline: playsinline,
        autoplay: this.props.playing,
        muted: this.props.muted,
        ...config.twitch.options
      })

      this.player.on('ready', this.props.onReady)
      this.player.on('playStateChange', ({ state, vid }) => {
        if (state == 1) {
          console.log('start play')
          this.props.onPlay()
        } else if (state == 2) {
          this.props.onPause()
        } 
      })
      this.player.on('timeupdate', ({ duration, seconds }) => {
        this.duration = duration
        this.currentTime = seconds
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
    // no stop support
  }

  seekTo (seconds) {
    this.callPlayer('seekTo', seconds)
  }

  setVolume (fraction) {
    this.callPlayer('setVolume', fraction * 100)
  }

  mute = () => {
    this.callPlayer('mute')
  }

  unmute = () => {
    this.callPlayer('unMute')
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

export default createSinglePlayer(Tencent)
