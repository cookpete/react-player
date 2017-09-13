import React from 'react'

import Base from './Base'
import { getSDK, parseStartTime } from '../utils'

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
    getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY, DM => DM.player).then(DM => {
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
            this.onReady()
          },
          seeked: () => this.props.onSeek(this.player.currentTime),
          video_end: this.onEnded,
          durationchange: this.onDurationChange,
          pause: this.props.onPause,
          playing: this.onPlay,
          waiting: this.props.onBuffer,
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
    this.callPlayer('play')
  }
  pause () {
    this.callPlayer('pause')
  }
  stop () {
    // Nothing to do
  }
  seekTo (amount) {
    const seconds = super.seekTo(amount)
    this.callPlayer('seek', seconds)
  }
  setVolume (fraction) {
    this.callPlayer('setVolume', fraction)
  }
  getDuration () {
    if (!this.isReady) return null
    return this.player.duration || null
  }
  getCurrentTime () {
    return this.player.currentTime
  }
  getSecondsLoaded () {
    return this.player.bufferedTime
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
