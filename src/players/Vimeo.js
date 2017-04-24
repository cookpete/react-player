import React from 'react'
import { stringify } from 'query-string'
import Player from '@vimeo/player'

import Base from './Base'

const IFRAME_SRC = 'https://player.vimeo.com/video/'
const MATCH_URL = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/
const BLANK_VIDEO_URL = 'https://vimeo.com/127250231'
const DEFAULT_IFRAME_PARAMS = {
  autoplay: 0,
  badge: 0,
  byline: 0,
  fullscreen: 1,
  portrait: 0,
  title: 0
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
  getIframeParams () {
    return { ...DEFAULT_IFRAME_PARAMS, ...this.props.vimeoConfig.iframeParams }
  }
  load (url) {
    const self = this
    const id = url.match(MATCH_URL)[3]
    this.iframe.src = IFRAME_SRC + id + '?' + stringify(this.getIframeParams())
    this.player = new Player(this.iframe, {
      ...this.props.vimeoConfig.playerOptions
    })
    this.player.on('play', this.onPlay)
    this.player.on('pause', this.props.onPause)
    this.player.on('ended', this.onEnded)

    this.player.on('timeupdate', function (e) {
      self.fractionPlayed = e.percent
    })
    this.player.on('progress', function (e) {
      self.fractionLoaded = e.percent
    })

    this.player.getDuration().then(function (duration) {
      self.duration = duration
      self.onReady()
    })
  }
  play () {
    this.player.play()
  }
  pause () {
    this.player.pause()
  }
  stop () {
    this.iframe.src = ''
  }
  seekTo (fraction) {
    super.seekTo(fraction)
    this.player.setCurrentTime(this.duration * fraction)
  }
  setVolume (fraction) {
    this.player.setVolume(fraction)
  }
  setPlaybackRate (rate) {
    // Not supported by Vimeo
  }
  getDuration () {
    return this.duration || null
  }
  getFractionPlayed () {
    return this.fractionPlayed || null
  }
  getFractionLoaded () {
    return this.fractionLoaded || null
  }
  onEnded = () => {
    const { loop, onEnded } = this.props
    if (loop) {
      this.player.setCurrentTime(0)
    }
    onEnded()
  }
  postMessage = (method, value) => {
    if (!this.origin) return
    const data = JSON.stringify({ method, value })
    return this.iframe.contentWindow && this.iframe.contentWindow.postMessage(data, this.origin)
  }
  ref = iframe => {
    this.iframe = iframe
  }
  render () {
    const { fullscreen } = this.getIframeParams()
    const style = {
      display: this.props.url ? 'block' : 'none',
      width: '100%',
      height: '100%'
    }
    return (
      <iframe
        ref={this.ref}
        frameBorder='0'
        style={style}
        allowFullScreen={fullscreen}
      />
    )
  }
}
