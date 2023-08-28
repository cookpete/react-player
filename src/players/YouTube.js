import React, { Component } from 'react'

import { callPlayer, getSDK, parseStartTime, parseEndTime } from '../utils'
import { canPlay, MATCH_URL_YOUTUBE } from '../patterns'

const SDK_URL = 'https://www.youtube.com/iframe_api'
const SDK_GLOBAL = 'YT'
const SDK_GLOBAL_READY = 'onYouTubeIframeAPIReady'
const MATCH_PLAYLIST = /[?&](?:list|channel)=([a-zA-Z0-9_-]+)/
const MATCH_USER_UPLOADS = /user\/([a-zA-Z0-9_-]+)\/?/
const MATCH_NOCOOKIE = /youtube-nocookie\.com/
const NOCOOKIE_HOST = 'https://www.youtube-nocookie.com'

export default class YouTube extends Component {
  static displayName = 'YouTube'
  static canPlay = canPlay.youtube
  callPlayer = callPlayer

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  getID (url) {
    if (!url || url instanceof Array || MATCH_PLAYLIST.test(url)) {
      return null
    }
    return url.match(MATCH_URL_YOUTUBE)[1]
  }

  load (url, isReady) {
    const { playing, muted, playsinline, controls, loop, config, onError } = this.props
    const { playerVars, embedOptions } = config
    const id = this.getID(url)
    if (isReady) {
      if (MATCH_PLAYLIST.test(url) || MATCH_USER_UPLOADS.test(url) || url instanceof Array) {
        this.player.loadPlaylist(this.parsePlaylist(url))
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
          playsinline: playsinline ? 1 : 0,
          ...this.parsePlaylist(url),
          ...playerVars
        },
        events: {
          onReady: () => {
            if (loop) {
              this.player.setLoop(true) // Enable playlist looping
            }
            this.props.onReady()
          },
          onPlaybackRateChange: event => this.props.onPlaybackRateChange(event.data),
          onPlaybackQualityChange: event => this.props.onPlaybackQualityChange(event),
          onStateChange: this.onStateChange,
          onError: event => onError(event.data)
        },
        host: MATCH_NOCOOKIE.test(url) ? NOCOOKIE_HOST : undefined,
        ...embedOptions
      })
    }, onError)
    if (embedOptions.events) {
      console.warn('Using `embedOptions.events` will likely break things. Use ReactPlayer’s callback props instead, eg onReady, onPlay, onPause')
    }
  }

  parsePlaylist = (url) => {
    if (url instanceof Array) {
      return {
        listType: 'playlist',
        playlist: url.map(this.getID).join(',')
      }
    }
    if (MATCH_PLAYLIST.test(url)) {
      const [, playlistId] = url.match(MATCH_PLAYLIST)
      return {
        listType: 'playlist',
        list: playlistId.replace(/^UC/, 'UU')
      }
    }
    if (MATCH_USER_UPLOADS.test(url)) {
      const [, username] = url.match(MATCH_USER_UPLOADS)
      return {
        listType: 'user_uploads',
        list: username
      }
    }
    return {}
  }

  onStateChange = (event) => {
    const { data } = event
    const { onPlay, onPause, onBuffer, onBufferEnd, onEnded, onReady, loop, config: { playerVars, onUnstarted } } = this.props
    const { UNSTARTED, PLAYING, PAUSED, BUFFERING, ENDED, CUED } = window[SDK_GLOBAL].PlayerState
    if (data === UNSTARTED) onUnstarted()
    if (data === PLAYING) {
      onPlay()
      onBufferEnd()
    }
    if (data === PAUSED) onPause()
    if (data === BUFFERING) onBuffer()
    if (data === ENDED) {
      const isPlaylist = !!this.callPlayer('getPlaylist')
      // Only loop manually if not playing a playlist
      if (loop && !isPlaylist) {
        if (playerVars.start) {
          this.seekTo(playerVars.start)
        } else {
          this.play()
        }
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

  seekTo (amount, keepPlaying = false) {
    this.callPlayer('seekTo', amount)
    if (!keepPlaying && !this.props.playing) {
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
    const { display } = this.props
    const style = {
      width: '100%',
      height: '100%',
      display
    }
    return (
      <div style={style}>
        <div ref={this.ref} />
      </div>
    )
  }
}
