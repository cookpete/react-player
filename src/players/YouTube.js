import React from 'react'
import loadScript from 'load-script'

import propTypes from '../propTypes'
import Base from './Base'

const SDK_URL = '//www.youtube.com/iframe_api'
const SDK_GLOBAL = 'YT'
const MATCH_URL = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
const PLAYER_ID = 'youtube-player'
const DEFAULT_PLAYER_VARS = {
  autoplay: 1,
  controls: 0,
  showinfo: 0
}

export default class YouTube extends Base {
  static propTypes = propTypes
  static defaultProps = {
    youtubeConfig: {}
  }
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  shouldComponentUpdate () {
    return false
  }
  getSDK () {
    if (window[SDK_GLOBAL]) {
      return Promise.resolve(window[SDK_GLOBAL])
    }
    return new Promise((resolve, reject) => {
      window.onYouTubeIframeAPIReady = function () {
        resolve(window[SDK_GLOBAL])
      }
      loadScript(SDK_URL, err => {
        if (err) reject(err)
      })
    })
  }
  play (url) {
    let id = url && url.match(MATCH_URL)[1]
    if (this.player) {
      if (id) {
        this.player.loadVideoById(id)
      } else {
        this.player.playVideo()
      }
      return
    }
    this.getSDK().then(YT => {
      this.player = new YT.Player(PLAYER_ID, {
        width: '100%',
        height: '100%',
        videoId: id,
        playerVars: { ...DEFAULT_PLAYER_VARS, ...this.props.youtubeConfig.playerVars },
        events: {
          onReady: this.onReady,
          onStateChange: this.onStateChange,
          onError: this.props.onError
        }
      })
    })
  }
  onStateChange = state => {
    let YT = window[SDK_GLOBAL]
    if (state.data === YT.PlayerState.PLAYING) this.props.onPlay()
    if (state.data === YT.PlayerState.PAUSED) this.props.onPause()
    if (state.data === YT.PlayerState.BUFFERING) this.props.onBuffer()
    if (state.data === YT.PlayerState.ENDED) this.props.onEnded()
  }
  pause () {
    if (!this.player) return
    this.player.pauseVideo()
  }
  stop () {
    if (!this.player) return
    this.player.stopVideo()
  }
  seekTo (fraction) {
    if (!this.player) return
    this.player.seekTo(this.player.getDuration() * fraction)
  }
  setVolume (fraction) {
    if (!this.player) return
    this.player.setVolume(fraction * 100)
  }
  getFractionPlayed () {
    if (!this.player || !this.player.getCurrentTime) return 0
    return this.player.getCurrentTime() / this.player.getDuration()
  }
  getFractionLoaded () {
    if (!this.player || !this.player.getVideoLoadedFraction) return 0
    return this.player.getVideoLoadedFraction()
  }
  render () {
    return <div id={PLAYER_ID} />
  }
}
