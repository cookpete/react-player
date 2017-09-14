import React from 'react'

import Base from './Base'
import { getSDK, parseStartTime } from '../utils'

const SDK_URL = 'https://www.youtube.com/iframe_api'
const SDK_GLOBAL = 'YT'
const SDK_GLOBAL_READY = 'onYouTubeIframeAPIReady'
const MATCH_URL = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
const BLANK_VIDEO_URL = 'https://www.youtube.com/watch?v=GlCmAC4MHek'

export default class YouTube extends Base {
  static displayName = 'YouTube'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  componentDidMount () {
    const { url, config } = this.props
    if (!url && config.youtube.preload) {
      this.preloading = true
      this.load(BLANK_VIDEO_URL)
    }
    super.componentDidMount()
  }
  load (url) {
    const { playsinline, controls, config, onError } = this.props
    const id = url && url.match(MATCH_URL)[1]
    if (this.isReady) {
      this.player.cueVideoById({
        videoId: id,
        startSeconds: parseStartTime(url)
      })
      return
    }
    if (this.loadingSDK) {
      this.loadOnReady = url
      return
    }
    this.loadingSDK = true
    getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY, YT => YT.loaded).then(YT => {
      this.player = new YT.Player(this.container, {
        width: '100%',
        height: '100%',
        videoId: id,
        playerVars: {
          controls: controls ? 1 : 0,
          start: parseStartTime(url),
          origin: window.location.origin,
          playsinline: playsinline,
          ...config.youtube.playerVars
        },
        events: {
          onReady: this.onReady,
          onStateChange: this.onStateChange,
          onError: event => onError(event.data)
        }
      })
    }, onError)
  }
  onStateChange = ({ data }) => {
    const { onPause, onBuffer } = this.props
    const { PLAYING, PAUSED, BUFFERING, ENDED, CUED } = window[SDK_GLOBAL].PlayerState
    if (data === PLAYING) this.onPlay()
    if (data === PAUSED) onPause()
    if (data === BUFFERING) onBuffer()
    if (data === ENDED) this.onEnded()
    if (data === CUED) this.onReady()
  }
  onEnded = () => {
    const { loop, onEnded } = this.props
    if (loop) {
      this.seekTo(0)
    }
    onEnded()
  }
  play () {
    this.callPlayer('playVideo')
  }
  pause () {
    this.callPlayer('pauseVideo')
  }
  stop () {
    if (this.preloading) return
    if (!document.body.contains(this.callPlayer('getIframe'))) return
    this.callPlayer('stopVideo')
  }
  seekTo (amount) {
    const seconds = super.seekTo(amount)
    this.callPlayer('seekTo', seconds)
  }
  setVolume (fraction) {
    this.callPlayer('setVolume', fraction * 100)
  }
  setPlaybackRate (rate) {
    this.callPlayer('setPlaybackRate', rate)
  }
  getDuration () {
    return this.callPlayer('getDuration')
  }
  getCurrentTime () {
    return this.callPlayer('getCurrentTime')
  }
  getSecondsLoaded () {
    return this.callPlayer('getVideoLoadedFraction') * this.getDuration()
  }
  ref = container => {
    this.container = container
  }
  render () {
    const style = {
      width: '100%',
      height: '100%',
      display: this.props.url ? 'block' : 'none'
    }
    return (
      <div style={style}>
        <div ref={this.ref} />
      </div>
    )
  }
}
