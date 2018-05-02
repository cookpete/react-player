import React, { Component } from 'react'
// import Hls from 'hls.js'

import { getSDK } from '../utils'
import createSinglePlayer from '../singlePlayer'

const IOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i
const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i
const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i
const HLS_SDK_URLS = ['https://cdn.jsdelivr.net/npm/hls.js@latest','https://cdnjs.cloudflare.com/ajax/libs/hls.js/0.9.1/hls.min.js']
const HLS_GLOBAL = 'Hls'
const DASH_EXTENSIONS = /\.(mpd)($|\?)/i
const DASH_SDK_URL = 'https://cdnjs.cloudflare.com/ajax/libs/dashjs/2.6.5/dash.all.min.js'
const DASH_GLOBAL = 'dashjs'

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
  load (url, retries = HLS_SDK_URLS.length - 1) {

    if (this.shouldUseHLS(url)) {
      // this.hls = new Hls(this.props.config.file.hlsOptions)
      // this.hls.on(Hls.Events.ERROR, (e, data) => {
      //   this.props.onError(e, data, this.hls, Hls)
      // })
      // this.hls.loadSource(url)
      // this.hls.attachMedia(this.player)
      getSDK(HLS_SDK_URLS[retries], HLS_GLOBAL).then(Hls => {
        this.hls = new Hls(this.props.config.file.hlsOptions)
        this.hls.on(Hls.Events.ERROR, (e, data) => {
          this.props.onError(e, data, this.hls, Hls)
        })
        this.hls.loadSource(url)
        this.hls.attachMedia(this.player)
      })
      .catch((err) => {
        console.log('hls failed to load', retries);
        retries--;
        if (!retries) {
          throw new Error('Hls is not loading from ', HLS_SDK_URL);
        } else {
          setTimeout(() => {
            this.load(url, retries);     
          }, 1000);
          
        }
        
      })
    }
    if (this.shouldUseDASH(url)) {
      getSDK(DASH_SDK_URL, DASH_GLOBAL).then(dashjs => {
        this.dash = dashjs.MediaPlayer().create()
        this.dash.initialize(this.player, url, this.props.playing)
        this.dash.getDebug().setLogToBrowserConsole(false)
      })
      .catch((err) => {
        retries--;
        if (!retries) {
          throw new Error('Dash is not loading from ', DASH_SDK_URL);
        } else {
          setTimeout(() => {
            this.load(url, retries);     
          }, 1000);
        }
      })
    }
  }
  play () {
    const promise = this.player.play()
    if (promise) {
      promise.catch(this.props.onError)
    }
  }
  pause () {
    this.player.pause()
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
    this.player.currentTime = seconds
  }
  setVolume (fraction) {
    this.player.volume = fraction
  }
  setPlaybackRate (rate) {
    this.player.playbackRate = rate
  }
  getDuration () {
    return this.player.duration
  }
  getCurrentTime () {
    return this.player.currentTime
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
}

export default createSinglePlayer(FilePlayer)
