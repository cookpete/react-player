import React, { Component } from 'react'

import { getSDK, isMediaStream } from '../utils'
import createSinglePlayer from '../singlePlayer'

const IOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i
const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i
const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i
const HLS_SDK_URL = 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/VERSION/hls.min.js'
const HLS_GLOBAL = 'Hls'
const DASH_EXTENSIONS = /\.(mpd)($|\?)/i
const DASH_SDK_URL = 'https://cdnjs.cloudflare.com/ajax/libs/dashjs/VERSION/dash.all.min.js'
const DASH_GLOBAL = 'dashjs'
const MATCH_DROPBOX_URL = /www\.dropbox\.com\/.+/

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

function canEnablePIP (url) {
  return canPlay(url) && !!document.pictureInPictureEnabled && !AUDIO_EXTENSIONS.test(url)
}

export class FilePlayer extends Component {
  static displayName = 'FilePlayer'
  static canPlay = canPlay
  static canEnablePIP = canEnablePIP

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
    const { onReady, onPlay, onBuffer, onBufferEnd, onPause, onEnded, onError, playsinline, onEnablePIP } = this.props
    this.player.addEventListener('canplay', onReady)
    this.player.addEventListener('play', onPlay)
    this.player.addEventListener('waiting', onBuffer)
    this.player.addEventListener('playing', onBufferEnd)
    this.player.addEventListener('pause', onPause)
    this.player.addEventListener('seeked', this.onSeek)
    this.player.addEventListener('ended', onEnded)
    this.player.addEventListener('error', onError)
    this.player.addEventListener('enterpictureinpicture', onEnablePIP)
    this.player.addEventListener('leavepictureinpicture', this.onDisablePIP)
    if (playsinline) {
      this.player.setAttribute('playsinline', '')
      this.player.setAttribute('webkit-playsinline', '')
      this.player.setAttribute('x5-playsinline', '')
    }
  }
  removeListeners () {
    const { onReady, onPlay, onBuffer, onBufferEnd, onPause, onEnded, onError, onEnablePIP } = this.props
    this.player.removeEventListener('canplay', onReady)
    this.player.removeEventListener('play', onPlay)
    this.player.removeEventListener('waiting', onBuffer)
    this.player.removeEventListener('playing', onBufferEnd)
    this.player.removeEventListener('pause', onPause)
    this.player.removeEventListener('seeked', this.onSeek)
    this.player.removeEventListener('ended', onEnded)
    this.player.removeEventListener('error', onError)
    this.player.removeEventListener('enterpictureinpicture', onEnablePIP)
    this.player.removeEventListener('leavepictureinpicture', this.onDisablePIP)
  }
  onDisablePIP = e => {
    const { onDisablePIP, playing } = this.props
    onDisablePIP(e)
    if (playing) {
      this.play()
    }
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
  load (url) {
    const { hlsVersion, dashVersion } = this.props.config.file
    if (this.shouldUseHLS(url)) {
      getSDK(HLS_SDK_URL.replace('VERSION', hlsVersion), HLS_GLOBAL).then(Hls => {
        this.hls = new Hls(this.props.config.file.hlsOptions)
        this.hls.on(Hls.Events.ERROR, (e, data) => {
          this.props.onError(e, data, this.hls, Hls)
        })
        this.hls.loadSource(url)
        this.hls.attachMedia(this.player)
      })
    }
    if (this.shouldUseDASH(url)) {
      getSDK(DASH_SDK_URL.replace('VERSION', dashVersion), DASH_GLOBAL).then(dashjs => {
        this.dash = dashjs.MediaPlayer().create()
        this.dash.initialize(this.player, url, this.props.playing)
        this.dash.getDebug().setLogToBrowserConsole(false)
      })
    }

    if (url instanceof Array) {
      // When setting new urls (<source>) on an already loaded video,
      // HTMLMediaElement.load() is needed to reset the media element
      // and restart the media resource. Just replacing children source
      // dom nodes is not enough
      this.player.load()
    } else if (isMediaStream(url)) {
      try {
        this.player.srcObject = url
      } catch (e) {
        this.player.src = window.URL.createObjectURL(url)
      }
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
  mute = () => {
    this.player.muted = true
  }
  unmute = () => {
    this.player.muted = false
  }
  enablePIP () {
    if (this.player.requestPictureInPicture && document.pictureInPictureElement !== this.player) {
      this.player.requestPictureInPicture()
    }
  }
  disablePIP () {
    if (document.exitPictureInPicture && document.pictureInPictureElement === this.player) {
      document.exitPictureInPicture()
    }
  }
  setPlaybackRate (rate) {
    this.player.playbackRate = rate
  }
  getDuration () {
    if (!this.player) return null
    const { duration, seekable } = this.player
    // on iOS, live streams return Infinity for the duration
    // so instead we use the end of the seekable timerange
    if (duration === Infinity && seekable.length > 0) {
      return seekable.end(seekable.length - 1)
    }
    return duration
  }
  getCurrentTime () {
    if (!this.player) return null
    return this.player.currentTime
  }
  getSecondsLoaded () {
    if (!this.player) return null
    const { buffered } = this.player
    if (buffered.length === 0) {
      return 0
    }
    const end = buffered.end(buffered.length - 1)
    const duration = this.getDuration()
    if (end > duration) {
      return duration
    }
    return end
  }
  getSource (url) {
    const useHLS = this.shouldUseHLS(url)
    const useDASH = this.shouldUseDASH(url)
    if (url instanceof Array || isMediaStream(url) || useHLS || useDASH) {
      return undefined
    }
    if (MATCH_DROPBOX_URL.test(url)) {
      return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
    }
    return url
  }
  renderSourceElement = (source, index) => {
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
    const { url, playing, loop, controls, muted, config, width, height } = this.props
    const useAudio = this.shouldUseAudio(this.props)
    const Element = useAudio ? 'audio' : 'video'
    const style = {
      width: width === 'auto' ? width : '100%',
      height: height === 'auto' ? height : '100%'
    }
    return (
      <Element
        ref={this.ref}
        src={this.getSource(url)}
        style={style}
        preload='auto'
        autoPlay={playing || undefined}
        controls={controls}
        muted={muted}
        loop={loop}
        {...config.file.attributes}>
        {url instanceof Array &&
          url.map(this.renderSourceElement)
        }
        {config.file.tracks.map(this.renderTrack)}
      </Element>
    )
  }
}

export default createSinglePlayer(FilePlayer)
