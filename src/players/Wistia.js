import React from 'react'
import loadScript from 'load-script'

import Base from './Base'

const SDK_URL = '//fast.wistia.com/assets/external/E-v1.js'
const MATCH_URL = /^https?:\/\/(.+)?(wistia.com|wi.st)\/(medias|embed)\/(.*)$/

export default class Wistia extends Base {
  static displayName = 'Wistia'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  constructor(props) {
    super(props)
    this.loadingSDK = true
    this.player = null
  }
  componentDidMount() {
    const { onStart, onPause, onEnded } = this.props
    this.getSDK().then((_script) => {
      window._wq = window._wq || []
      _wq.push({ id: this.getVideoId(this.props.url), onReady: (video) => {
        this.loadingSDK = false
        this.player = video
        this.player.bind('start', onStart)
        this.player.bind('play', this.onPlay)
        this.player.bind('pause', onPause)
        this.player.bind('end', onEnded)
        this.onReady()
      }})
    })
  }
  getSDK () {
    return new Promise((resolve, reject) => {
      loadScript(SDK_URL, (err, script) => {
        if (err) reject(err)
        resolve(script)
      })
    })
  }
  load (url) {
    const wistiaId = this.getVideoId(url)
    if (this.isReady) {
      this.player.replaceWith(wistiaId);
      this.props.onReady()
      this.onReady()
      return
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
    if (!this.isReady || !this.player ) return
    this.player.time(this.getDuration() * fraction)
  }
  setVolume (fraction) {
    if (!this.isReady || !this.player || !this.player.volume) return
    this.player.volume(fraction)
  }
  getDuration () {
    if (!this.isReady || !this.player || !this.player.duration) return
    return this.player.duration()
  }
  getFractionPlayed () {
    if (!this.isReady || !this.player || !this.player.percentWatched) return null
    return this.player.percentWatched()
  }
  getFractionLoaded () {
    return null
  }
  getVideoId(url) {
    return url && url.match(MATCH_URL)[4]
  }
  ref = container => {
    this.container = container
  }
  render () {
    const style = {
      width: '100%',
      height: '100%',
      display: this.props.url ? 'block' : 'none'
    }

    const id = this.getVideoId(this.props.url)
    return (
      <div ref={this.ref} className={`wistia_embed wistia_async_${id}`} style={style} />
    )
  }
}
