import React from 'react'

import Base from './Base'
import { getSDK } from '../utils'

const SDK_URL = '//fast.wistia.com/assets/external/E-v1.js'
const SDK_GLOBAL = 'Wistia'
const MATCH_URL = /^https?:\/\/(.+)?(wistia.com|wi.st)\/(medias|embed)\/(.*)$/

export default class Wistia extends Base {
  static displayName = 'Wistia'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  getID (url) {
    return url && url.match(MATCH_URL)[4]
  }
  load (url) {
    const { onStart, onPause, onSeek, onEnded, config } = this.props
    this.loadingSDK = true
    getSDK(SDK_URL, SDK_GLOBAL).then(() => {
      window._wq = window._wq || []
      window._wq.push({
        id: this.getID(url),
        options: config.wistia.options,
        onReady: player => {
          this.player = player
          this.player.bind('start', onStart)
          this.player.bind('play', this.onPlay)
          this.player.bind('pause', onPause)
          this.player.bind('seek', onSeek)
          this.player.bind('end', onEnded)
          this.onReady()
        }
      })
    })
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
  seekTo (amount) {
    const seconds = super.seekTo(amount)
    if (!this.isReady || !this.player) return
    this.player.time(seconds)
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
      <div key={id} className={className} style={style} />
    )
  }
}
