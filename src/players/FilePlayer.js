import React, { Component } from 'react'
// import Hls from 'hls.js'

import { getSDK, isMediaStream } from '../utils'
import createSinglePlayer from '../singlePlayer'

const IOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i
const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i
const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i
const HLS_SDK_URLS = ['https://cdn.jsdelivr.net/npm/hls.js@latest', 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/0.10.1/hls.min.js']
const HLS_GLOBAL = 'Hls'
const DASH_EXTENSIONS = /\.(mpd)($|\?)/i
const DASH_SDK_URLS = ['https://cdnjs.cloudflare.com/ajax/libs/dashjs/2.6.5/dash.all.min.js', 'https://cdn.dashjs.org/latest/dash.all.min.js']
const DASH_GLOBAL = 'dashjs'
const HLS = 'hls'
const DASH = 'dash'

function canPlay (url) {
    if (url instanceof Array) {
        for (let item of url) {
            if (typeof item === 'string' && canPlay(item)) {
                return true
            }
            if (canPlay(item.src)) {
                return true
            }
        }
        return false
    }
    if (isMediaStream(url)) {
        return true
    }
    return (
        AUDIO_EXTENSIONS.test(url) ||
        VIDEO_EXTENSIONS.test(url) ||
        HLS_EXTENSIONS.test(url) ||
        DASH_EXTENSIONS.test(url)
    )
}

export class FilePlayer extends Component {
  static displayName = 'FilePlayer'
  static canPlay = canPlay

  componentDidMount () {
    this.addListeners()
    if (IOS) {
      this.player.load()
    }
  }
  componentWillReceiveProps (nextProps) {
    if (this.shouldUseAudio(this.props) !== this.shouldUseAudio(nextProps)) {
      this.removeListeners()
    }
  }
  componentDidUpdate (prevProps) {
    if (this.shouldUseAudio(this.props) !== this.shouldUseAudio(prevProps)) {
      this.addListeners()
    }
  }
  componentWillUnmount () {
    this.removeListeners()
  }
  addListeners () {
    const { onReady, onPlay, onPause, onEnded, onError, playsinline } = this.props
    this.player.addEventListener('canplay', onReady)
    this.player.addEventListener('play', onPlay)
    this.player.addEventListener('pause', onPause)
    this.player.addEventListener('seeked', this.onSeek)
    this.player.addEventListener('ended', onEnded)
    this.player.addEventListener('error', onError)
    if (playsinline) {
      this.player.setAttribute('playsinline', '')
      this.player.setAttribute('webkit-playsinline', '')
    }
  }
  removeListeners () {
    const { onReady, onPlay, onPause, onEnded, onError } = this.props
    this.player.removeEventListener('canplay', onReady)
    this.player.removeEventListener('play', onPlay)
    this.player.removeEventListener('pause', onPause)
    this.player.removeEventListener('seeked', this.onSeek)
    this.player.removeEventListener('ended', onEnded)
    this.player.removeEventListener('error', onError)
  }
  onSeek = e => {
    this.props.onSeek(e.target.currentTime)
  }
  shouldUseAudio (props) {
    if (props.config.file.forceVideo) {
      return false
    }
    if (props.config.file.attributes.poster) {
      return false // Use <video> so that poster is shown
    }
    return AUDIO_EXTENSIONS.test(props.url) || props.config.file.forceAudio
  }
  shouldUseHLS (url) {
    return (HLS_EXTENSIONS.test(url) && !IOS) || this.props.config.file.forceHLS
  }
  shouldUseDASH (url) {
    return DASH_EXTENSIONS.test(url) || this.props.config.file.forceDASH
  }
  // TODO: Change retries to an array of urls that is whittled down.
  load (url, retries = null) {
    // deal with hls videos
    if (this.shouldUseHLS(url)) {
      const hlsUrls = this.getLibraryUrlArray(HLS)
      if (retries === null) {
        retries = hlsUrls.length - 1
      }
      getSDK(hlsUrls[retries], HLS_GLOBAL).then(Hls => {
        this.hls = new Hls(this.props.config.file.hlsOptions)
        this.hls.on(Hls.Events.ERROR, (e, data) => {
          this.props.onError(e, data, this.hls, Hls)
        })
        this.hls.loadSource(url)
        this.hls.attachMedia(this.player)
      })
        .catch((err) => {
          // to get around lint error https://eslint.org/docs/rules/handle-callback-err
          if (err) {
            retries -= 1
            if (retries < 0) {
              throw new Error(`Hls is not loading from ${this.getLibraryUrlArray(HLS).join(' ')}`)
            } else {
              setTimeout(() => {
                this.load(url, retries)
              }, 1000)
            }
          }
        })
    }
    // deal with dash videos
    if (this.shouldUseDASH(url)) {
      const dashUrls = this.getLibraryUrlArray(DASH)
      if (retries === null) {
        retries = dashUrls.length - 1
      }
      getSDK(dashUrls[retries], DASH_GLOBAL).then(dashjs => {
        this.dash = dashjs.MediaPlayer().create()
        this.dash.initialize(this.player, url, this.props.playing)
        this.dash.getDebug().setLogToBrowserConsole(false)
      })
        .catch((err) => {
          // to get around lint error https://eslint.org/docs/rules/handle-callback-err
          if (err) {
            retries -= 1
            if (retries < 0) {
              throw new Error(`Dash is not loading from ${this.getLibraryUrlArray(DASH).join(' ')}`)
            } else {
              setTimeout(() => {
                this.load(url, retries)
              }, 1000)
            }
          }
        })
    }
  }
  play () {
    try {
      const promise = this.player.play()
      if (promise) {
        promise.catch(this.props.onError)
      }
    } catch (err) {
      throw new Error(`FilePlayer error trying to play video: ${err.message}`)
    }
  }
  pause () {
    if (this.player) this.player.pause()
  }
  stop () {
    this.player.removeAttribute('src')
    if (this.hls) {
      this.hls.destroy()
    }
    if (this.dash) {
      this.dash.reset()
    }
  }
  seekTo (seconds) {
    if (this.player) this.player.currentTime = seconds
  }
  setVolume (fraction) {
    if (this.player) this.player.volume = fraction
  }
  setPlaybackRate (rate) {
    if (this.player) this.player.playbackRate = rate
  }
  getDuration () {
    return this.player ? this.player.duration : 0
  }
  getCurrentTime () {
    return this.player ? this.player.currentTime : 0
  }
  // This methodology was take from video.js
  getBufferedEnd () {
    const buffered = this.player.buffered
    const duration = this.getDuration()
    let end = buffered.end(buffered.length - 1)

    if (end > duration) {
      end = duration
    }

    return end
  }
  getSecondsLoaded () {
    if (this.player.buffered.length === 0) return 0
    return this.getBufferedEnd()
  }
  renderSource = (source, index) => {
    if (typeof source === 'string') {
      return <source key={index} src={source} />
    }
    return <source key={index} {...source} />
  }
  renderTrack = (track, index) => {
    return <track key={index} {...track} />
  }
  ref = player => {
    this.player = player
  }
  render () {
    const { url, loop, controls, config, width, height } = this.props
    const useAudio = this.shouldUseAudio(this.props)
    const useHLS = this.shouldUseHLS(url)
    const useDASH = this.shouldUseDASH(url)
    const Element = useAudio ? 'audio' : 'video'
    const src = url instanceof Array || useHLS || useDASH ? undefined : url
    const style = {
      width: !width || width === 'auto' ? width : '100%',
      height: !height || height === 'auto' ? height : '100%'
    }
    return (
      <Element
        ref={this.ref}
        src={src}
        style={style}
        preload='auto'
        controls={controls}
        loop={loop}
        {...config.file.attributes}>
        {url instanceof Array &&
          url.map(this.renderSource)
        }
        {config.file.tracks.map(this.renderTrack)}
      </Element>
    )
  }
  getLibraryUrlArray (type) {
    const { config } = this.props
    const { file } = config
    switch (type) {
      case HLS:
        if (file && file.libraryUrl && file.libraryUrl.hls) {
          return [file.libraryUrl.hls, ...HLS_SDK_URLS]
        }
        return HLS_SDK_URLS
      case DASH:
        if (file && file.libraryUrl && file.libraryUrl.dash) {
          return [file.libraryUrl.hls, ...DASH_SDK_URLS]
        }
        return DASH_SDK_URLS
    }
  }
}

export default createSinglePlayer(FilePlayer)
