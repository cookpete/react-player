import React, {Component} from 'react'

import {getSDK} from '../utils'

const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i
const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i
const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i
const HLS_SDK_URL = 'https://cdn.jsdelivr.net/hls.js/latest/hls.min.js'
const HLS_GLOBAL = 'Hls'
const DASH_EXTENSIONS = /\.(mpd)($|\?)/i
const DASH_SDK_URL = 'https://cdnjs.cloudflare.com/ajax/libs/dashjs/2.5.0/dash.all.min.js'
const DASH_GLOBAL = 'dashjs'

function canPlay(url) {
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
  return (
    AUDIO_EXTENSIONS.test(url) || VIDEO_EXTENSIONS.test(url) || HLS_EXTENSIONS.test(url) || DASH_EXTENSIONS.test(url)
  )
}

export default class FilePlayer extends Component {
  static displayName = 'FilePlayer'
  static canPlay = canPlay

  componentDidMount() {
    this.addListeners()
  }
  componentWillReceiveProps(nextProps) {
    if (this.shouldUseAudio(this.props) !== this.shouldUseAudio(nextProps)) {
      this.removeListeners()
    }
  }
  componentDidUpdate(prevProps) {
    if (this.shouldUseAudio(this.props) !== this.shouldUseAudio(prevProps)) {
      this.addListeners()
    }
  }
  componentWillUnmount() {
    this.removeListeners()
  }
  addListeners() {
    const {onReady, onPlay, onPause, onEnded, onError, playsinline} = this.props
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
  removeListeners() {
    const {onReady, onPlay, onPause, onEnded, onError} = this.props
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
  shouldUseAudio(props) {
    return AUDIO_EXTENSIONS.test(props.url) || props.config.file.forceAudio
  }
  shouldUseHLS(url) {
    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    return (HLS_EXTENSIONS.test(url) && !iOS) || this.props.config.file.forceHLS
  }
  shouldUseHLSWithCookies(url) {
    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    return (
      (HLS_EXTENSIONS.test(url) && !iOS) ||
      (this.props.config.file.forceHLS && this.props.config.file.forceHLSWithCookies)
    )
  }
  shouldUseDASH(url) {
    return DASH_EXTENSIONS.test(url) || this.props.config.file.forceDASH
  }
  load(url, cookies) {
    if (this.shouldUseHLS(url)) {
      getSDK(HLS_SDK_URL, HLS_GLOBAL).then(Hls => {
        this.hls = new Hls()
        this.hls.loadSource(url)
        this.hls.attachMedia(this.player)
      })
    }

    if (cookies && this.shouldUseHLSWithCookies(url, cookies)) {
      // const config = {
      //   xhrSetup: (xhr, url) => (xhr.withCredentials = true) // do send cookies
      // }

      const config = {
        debug: true,
        xhrSetup: (xhr, url) => {
          xhr.withCredentials = true
          xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Requested-With')
          xhr.setRequestHeader('Access-Control-Allow-Origin', 'localhost:3000')
          xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true')
        }
      }

      getSDK(HLS_SDK_URL, HLS_GLOBAL).then(Hls => {
        this.hls = new Hls(config)
        this.hls.loadSource(url)
        console.log('this.hls', this.hls.config)
        this.hls.attachMedia(this.player)
      })
    }

    if (this.shouldUseDASH(url)) {
      getSDK(DASH_SDK_URL, DASH_GLOBAL).then(dashjs => {
        this.dash = dashjs.MediaPlayer().create()
        this.dash.initialize(this.player, url, this.props.playing)
        this.dash.getDebug().setLogToBrowserConsole(false)
      })
    }
  }
  play() {
    const promise = this.player.play()
    if (promise) {
      promise.catch(this.props.onError)
    }
  }
  pause() {
    this.player.pause()
  }
  stop() {
    this.player.removeAttribute('src')
    if (this.hls) {
      this.hls.destroy()
    }
    if (this.dash) {
      this.dash.reset()
    }
  }
  seekTo(seconds) {
    this.player.currentTime = seconds
  }
  setVolume(fraction) {
    this.player.volume = fraction
  }
  setPlaybackRate(rate) {
    this.player.playbackRate = rate
  }
  getDuration() {
    return this.player.duration
  }
  getCurrentTime() {
    return this.player.currentTime
  }
  getSecondsLoaded() {
    if (this.player.buffered.length === 0) return 0
    return this.player.buffered.end(0)
  }
  renderSource = (source, index) => {
    if (typeof source === 'string') {
      return <source key={index} src={source} />
    }
    const {src, type} = source
    return <source key={index} src={src} type={type} />
  }
  renderTrack = (track, index) => {
    return <track key={index} {...track} />
  }
  ref = player => {
    this.player = player
  }
  render() {
    const {url, loop, controls, config, width, height, cookies} = this.props
    const useAudio = this.shouldUseAudio(this.props)
    const useHLS = this.shouldUseHLS(url)
    const useHLSWithCookies = this.shouldUseHLSWithCookies(url, cookies)
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
        preload="auto"
        controls={controls}
        loop={loop}
        {...config.file.attributes}>
        {url instanceof Array && url.map(this.renderSource)}
        {config.file.tracks.map(this.renderTrack)}
      </Element>
    )
  }
}
