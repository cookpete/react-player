import React from 'react'
import loadScript from 'load-script'

import Base from './Base'

const SDK_URL = '//fast.wistia.com/assets/external/E-v1.js'
const SDK_GLOBAL = 'Wistia'
const MATCH_URL = /^https?:\/\/(.+)?(wistia.com|wi.st)\/(medias|embed)\/(.*)$/

export default class Wistia extends Base {
  static displayName = 'Wistia'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  componentDidMount () {
    const { onStart, onPause, onEnded, wistiaConfig } = this.props
    this.loadingSDK = true
    this.getSDK().then(() => {
      window._wq = window._wq || []
      window._wq.push({
        id: this.getID(this.props.url),
        options: wistiaConfig.options,
        onReady: player => {
          this.player = player
          this.player.bind('start', onStart)
          this.player.bind('play', this.onPlay)
          this.player.bind('pause', onPause)
          this.player.bind('end', onEnded)
          this.onReady()
        }
      })
    })
  }
  getSDK () {
    return new Promise((resolve, reject) => {
      if (window[SDK_GLOBAL]) {
        resolve()
      } else {
        loadScript(SDK_URL, (err, script) => {
          if (err) reject(err)
          resolve(script)
        })
      }
    })
  }
  getID (url) {
    return url && url.match(MATCH_URL)[4]
  }
  load (url) {
    const id = this.getID(url)
    if (this.isReady) {
      this.player.replaceWith(id)
      this.props.onReady()
      this.onReady()
    }
  }
  play () {
    if (!this.isReady || !this.player) return
    this.player.play()
  }
  pause () {
    if (!this.isReady || !this.player) return
    this.player && this.player.pause()
  }
  stop () {
    if (!this.isReady || !this.player) return
    this.player.pause()
  }
  seekTo (fraction) {
    super.seekTo(fraction)
    if (!this.isReady || !this.player) return
    this.player.time(this.getDuration() * fraction)
  }
  setVolume (fraction) {
    if (!this.isReady || !this.player || !this.player.volume) return
    this.player.volume(fraction)
  }
  setPlaybackRate (rate) {
    if (!this.isReady || !this.player || !this.player.playbackRate) return
    this.player.playbackRate(rate)
  }
  getDuration () {
    if (!this.isReady || !this.player || !this.player.duration) return
    return this.player.duration()
  }
  getFractionPlayed () {
    if (!this.isReady || !this.player || !this.player.percentWatched) return null
    return this.player.time() / this.player.duration()
  }
  getFractionLoaded () {
    return null
  }
  render () {
    const id = this.getID(this.props.url)
    const className = `wistia_embed wistia_async_${id}`
    const style = {
      width: '100%',
      height: '100%',
      display: this.props.url ? 'block' : 'none'
    }
    return (
      <div className={className} style={style} />
    )
  }
}
