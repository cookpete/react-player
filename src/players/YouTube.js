import React from 'react'
import loadScript from 'load-script'

import Base from './Base'

const SDK_URL = '//www.youtube.com/iframe_api'
const SDK_GLOBAL = 'YT'
const MATCH_URL = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
const PLAYER_ID = 'youtube-player'
const BLANK_VIDEO_URL = 'https://www.youtube.com/watch?v=GlCmAC4MHek'
const DEFAULT_PLAYER_VARS = {
  autoplay: 0,
  controls: 0,
  showinfo: 0
}

let count = 0

export default class YouTube extends Base {
  static displayName = 'YouTube'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  playerId = PLAYER_ID + '-' + count++
  componentDidMount () {
    if (!this.props.url && this.props.youtubeConfig.preload) {
      this.preloading = true
      this.load(BLANK_VIDEO_URL)
    }
    super.componentDidMount()
  }
  getSDK () {
    if (window[SDK_GLOBAL]) {
      return Promise.resolve(window[SDK_GLOBAL])
    }
    return new Promise((resolve, reject) => {
      const previousOnReady = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = function () {
        if (previousOnReady) previousOnReady()
        resolve(window[SDK_GLOBAL])
      }
      loadScript(SDK_URL, err => {
        if (err) reject(err)
      })
    })
  }
  load (url, playing) {
    const id = url && url.match(MATCH_URL)[1]
    if (this.isReady) {
      this.stop()
      if (playing) {
        this.player.loadVideoById(id)
      } else {
        this.player.cueVideoById(id)
      }
      return
    }
    this.getSDK().then(YT => {
      this.player = new YT.Player(this.playerId, {
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
    const YT = window[SDK_GLOBAL]
    if (state.data === YT.PlayerState.PLAYING) this.props.onPlay()
    if (state.data === YT.PlayerState.PAUSED) this.props.onPause()
    if (state.data === YT.PlayerState.BUFFERING) this.props.onBuffer()
    if (state.data === YT.PlayerState.ENDED) this.props.onEnded()
  }
  play () {
    if (!this.isReady) return
    this.player.playVideo()
  }
  pause () {
    if (!this.isReady) return
    this.player.pauseVideo()
  }
  stop () {
    if (!this.isReady) return
    this.player.stopVideo()
  }
  seekTo (fraction) {
    if (!this.isReady) return
    this.player.seekTo(this.player.getDuration() * fraction)
  }
  setVolume (fraction) {
    if (!this.isReady) return
    this.player.setVolume(fraction * 100)
  }
  getFractionPlayed () {
    if (!this.isReady) return null
    return this.player.getCurrentTime() / this.player.getDuration()
  }
  getFractionLoaded () {
    if (!this.isReady) return null
    return this.player.getVideoLoadedFraction()
  }
  render () {
    const style = { display: this.props.url ? 'block' : 'none' }
    return <div id={this.playerId} style={style} />
  }
}
