import React from 'react'
import { findDOMNode } from 'react-dom'
import loadScript from 'load-script'

import Base from './Base'

const SDK_URL = 'https://player.vimeo.com/api/player.js'
const SDK_GLOBAL = 'Vimeo'
const MATCH_URL = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/
const BLANK_VIDEO_URL = 'https://vimeo.com/127250231'

const DEFAULT_OPTIONS = {
  autopause: false,
  autoplay: false,
  byline: false,
  portrait: false,
  title: false
}

export default class Vimeo extends Base {
  static displayName = 'Vimeo'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  componentDidMount () {
    const { url, vimeoConfig } = this.props
    if (!url && vimeoConfig.preload) {
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
      loadScript(SDK_URL, err => {
        if (err) reject(err)
        else resolve(window[SDK_GLOBAL])
      })
    })
  }
  load (url) {
    const id = url.match(MATCH_URL)[3]
    this.duration = null
    if (this.isReady) {
      this.player.loadVideo(id)
      return
    }
    if (this.loadingSDK) {
      this.loadOnReady = url
      return
    }
    this.loadingSDK = true
    this.getSDK().then(Vimeo => {
      this.player = new Vimeo.Player(this.container, {
        ...DEFAULT_OPTIONS,
        ...this.props.vimeoConfig.playerOptions,
        url,
        loop: this.props.loop
      })
      this.player.on('loaded', () => {
        this.onReady()
        const iframe = findDOMNode(this).querySelector('iframe')
        iframe.style.width = '100%'
        iframe.style.height = '100%'
      })
      this.player.on('play', ({ duration }) => {
        this.duration = duration
        this.onPlay()
      })
      this.player.on('pause', this.props.onPause)
      this.player.on('ended', this.props.onEnded)
      this.player.on('error', this.props.onError)
      this.player.on('timeupdate', ({ percent }) => {
        this.fractionPlayed = percent
      })
      this.player.on('progress', ({ percent }) => {
        this.fractionLoaded = percent
      })
    }, this.props.onError)
  }
  play () {
    if (!this.isReady) return
    this.player.play()
  }
  pause () {
    if (!this.isReady) return
    this.player.pause()
  }
  stop () {
    if (!this.isReady) return
    this.player.unload()
  }
  seekTo (fraction) {
    super.seekTo(fraction)
    if (!this.isReady || !this.player.setCurrentTime) return
    this.player.setCurrentTime(this.duration * fraction)
  }
  setVolume (fraction) {
    this.player.setVolume(fraction)
  }
  setPlaybackRate (rate) {
    return null
  }
  getDuration () {
    return this.duration
  }
  getFractionPlayed () {
    return this.fractionPlayed || null
  }
  getFractionLoaded () {
    return this.fractionLoaded || null
  }
  ref = container => {
    this.container = container
  }
  render () {
    const style = {
      height: '100%',
      display: this.props.url ? 'block' : 'none'
    }
    return <div style={style} ref={this.ref} />
  }
}
