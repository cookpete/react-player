import React from 'react'

import Base from './Base'
import { getSDK } from '../utils'

const SDK_URL = 'https://player.vimeo.com/api/player.js'
const SDK_GLOBAL = 'Vimeo'
const MATCH_URL = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/
const BLANK_VIDEO_URL = 'https://vimeo.com/127250231'

export default class Vimeo extends Base {
  static displayName = 'Vimeo'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  componentDidMount () {
    const { url, config } = this.props
    if (!url && config.vimeo.preload) {
      this.preloading = true
      this.load(BLANK_VIDEO_URL)
    }
    super.componentDidMount()
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
    getSDK(SDK_URL, SDK_GLOBAL).then(Vimeo => {
      this.player = new Vimeo.Player(this.container, {
        ...this.props.config.vimeo.playerOptions,
        url,
        loop: this.props.loop
      })
      this.player.on('loaded', () => {
        this.onReady()
        const iframe = this.container.querySelector('iframe')
        iframe.style.width = '100%'
        iframe.style.height = '100%'
      })
      this.player.on('play', ({ duration }) => {
        this.duration = duration
        this.onPlay()
      })
      this.player.on('pause', this.props.onPause)
      this.player.on('seeked', e => this.props.onSeek(e.seconds))
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
  seekTo (amount) {
    const seconds = super.seekTo(amount)
    if (!this.isReady || !this.player.setCurrentTime) return
    this.player.setCurrentTime(seconds)
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
