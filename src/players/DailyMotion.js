import React from 'react'
import loadScript from 'load-script'

import Base from './Base'
import { parseStartTime } from '../utils'

const SDK_URL = 'https://api.dmcdn.net/all.js'
const SDK_GLOBAL = 'DM'
const SDK_GLOBAL_READY = 'dmAsyncInit'
const MATCH_URL = /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/
const BLANK_VIDEO_URL = 'http://www.dailymotion.com/video/x522udb'

export default class DailyMotion extends Base {
  static displayName = 'DailyMotion'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  componentDidMount () {
    const { url, config } = this.props
    if (!url && config.dailymotion.preload) {
      this.preloading = true
      this.load(BLANK_VIDEO_URL)
    }
    super.componentDidMount()
  }
  getSDK () {
    if (window[SDK_GLOBAL] && window[SDK_GLOBAL].player) {
      return Promise.resolve(window[SDK_GLOBAL])
    }
    return new Promise((resolve, reject) => {
      const previousOnReady = window[SDK_GLOBAL_READY]
      window[SDK_GLOBAL_READY] = function () {
        if (previousOnReady) previousOnReady()
        resolve(window[SDK_GLOBAL])
      }
      loadScript(SDK_URL, err => {
        if (err) {
          reject(err)
        }
      })
    })
  }
  parseId (url) {
    const m = url.match(MATCH_URL)
    return m[4] || m[2]
  }
  load (url) {
    const { controls, config, onError, playing } = this.props
    const id = this.parseId(url)
    if (this.player) {
      this.player.load(id, {
        start: parseStartTime(url),
        autoplay: playing
      })
      return
    }
    if (this.loadingSDK) {
      this.loadOnReady = url
      return
    }
    this.loadingSDK = true
    this.getSDK().then(DM => {
      const Player = DM.player
      this.player = new Player(this.container, {
        width: '100%',
        height: '100%',
        video: id,
        params: {
          controls: controls,
          autoplay: this.props.playing,
          start: parseStartTime(url),
          origin: window.location.origin,
          ...config.dailymotion.params
        },
        events: {
          apiready: () => {
            this.loadingSDK = false
          },
          video_end: this.onEnded,
          durationchange: this.onDurationChange,
          pause: this.props.onPause,
          playing: this.onPlay,
          waiting: this.props.onBuffer,
          loadedmetadata: this.onReady,
          error: event => onError(event)
        }
      })
    }, onError)
  }
  onDurationChange = (event) => {
    const { onDuration } = this.props
    const duration = this.getDuration()
    onDuration(duration)
  }
  onEnded = () => {
    const { loop, onEnded } = this.props
    if (loop) {
      this.seekTo(0)
    }
    onEnded()
  }
  play () {
    if (!this.isReady || !this.player.play) return
    this.player.play()
  }
  pause () {
    if (!this.isReady || !this.player.pause) return
    this.player.pause()
  }
  stop () {
    // Nothing to do
  }
  seekTo (amount) {
    const seconds = super.seekTo(amount)
    if (!this.isReady || !this.player.seek) return
    this.player.seek(seconds)
  }
  setVolume (fraction) {
    if (!this.isReady || !this.player.setVolume) return
    this.player.setVolume(fraction)
  }
  setPlaybackRate () {
    return null
  }
  getDuration () {
    if (!this.isReady || !this.player.duration) return null
    return this.player.duration
  }
  getFractionPlayed () {
    if (!this.isReady || !this.getDuration()) return null
    return this.player.currentTime / this.getDuration()
  }
  getFractionLoaded () {
    if (!this.isReady || !this.getDuration() || !this.player.bufferedTime) return null
    return this.player.bufferedTime / this.getDuration()
  }
  ref = container => {
    this.container = container
  }
  render () {
    const style = {
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      display: this.props.url ? 'block' : 'none'
    }
    return (
      <div style={style}>
        <div ref={this.ref} />
      </div>
    )
  }
}
