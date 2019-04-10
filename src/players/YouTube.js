import React, { Component } from 'react'

import { callPlayer, getSDK, parseStartTime, parseEndTime } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = 'https://www.youtube.com/iframe_api'
const SDK_GLOBAL = 'YT'
const SDK_GLOBAL_READY = 'onYouTubeIframeAPIReady'
const MATCH_URL = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=/
const MATCH_PLAYLIST = /list=([a-zA-Z0-9_-]+)/

function parsePlaylist (url) {
  if (MATCH_PLAYLIST.test(url)) {
    const [, playlistId] = url.match(MATCH_PLAYLIST)
    return {
      listType: 'playlist',
      list: playlistId
    }
  }
  return {}
}

export class YouTube extends Component {
  static displayName = 'YouTube'
  static canPlay = url => MATCH_URL.test(url)

  callPlayer = callPlayer
  load (url, isReady) {
    const { playing, muted, playsinline, controls, loop, config, onError } = this.props
    const { playerVars, embedOptions } = config.youtube
    const id = url && url.match(MATCH_URL)[1]
    if (isReady) {
      if (MATCH_PLAYLIST.test(url)) {
        this.player.loadPlaylist(parsePlaylist(url))
        return
      }
      this.player.cueVideoById({
        videoId: id,
        startSeconds: parseStartTime(url) || playerVars.start,
        endSeconds: parseEndTime(url) || playerVars.end
      })
      return
    }
    getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY, YT => YT.loaded).then(YT => {
      if (!this.container) return
      this.player = new YT.Player(this.container, {
        width: '100%',
        height: '100%',
        videoId: id,
        playerVars: {
          autoplay: playing ? 1 : 0,
          mute: muted ? 1 : 0,
          controls: controls ? 1 : 0,
          start: parseStartTime(url),
          end: parseEndTime(url),
          origin: window.location.origin,
          playsinline: playsinline,
          ...parsePlaylist(url),
          ...playerVars
        },
        events: {
          onReady: this.props.onReady,
          onStateChange: this.onStateChange,
          onError: event => onError(event.data)
        },
        ...embedOptions
      })
      if (loop) {
        this.player.setLoop(true) // Enable playlist looping
      }
    }, onError)
  }
  onStateChange = ({ data }) => {
    const { onPlay, onPause, onBuffer, onBufferEnd, onEnded, onReady, loop } = this.props
    const { PLAYING, PAUSED, BUFFERING, ENDED, CUED } = window[SDK_GLOBAL].PlayerState
    if (data === PLAYING) {
      onPlay()
      onBufferEnd()
    }
    if (data === PAUSED) onPause()
    if (data === BUFFERING) onBuffer()
    if (data === ENDED) {
      const isPlaylist = !!this.callPlayer('getPlaylist')
      if (loop && !isPlaylist) {
        this.play() // Only loop manually if not playing a playlist
      }
      onEnded()
    }
    if (data === CUED) onReady()
  }
  play () {
    this.callPlayer('playVideo')
  }
  pause () {
    this.callPlayer('pauseVideo')
  }
  stop () {
    if (!document.body.contains(this.callPlayer('getIframe'))) return
    this.callPlayer('stopVideo')
  }
  seekTo (amount) {
    this.callPlayer('seekTo', amount)
    if (!this.props.playing) {
      this.pause()
    }
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
  setPlaybackRate (rate) {
    this.callPlayer('setPlaybackRate', rate)
  }
  setLoop (loop) {
    this.callPlayer('setLoop', loop)
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
      ...this.props.style
    }
    return (
      <div style={style}>
        <div ref={this.ref} />
      </div>
    )
  }
}

export default createSinglePlayer(YouTube)
