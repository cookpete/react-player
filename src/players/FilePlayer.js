import React from 'react'

import Base from './Base'

const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm)($|\?)/
const AUDIO_EXTENSIONS = /\.(mp3|wav)($|\?)/

// since the souncldou player did the url matching job
// only a valid sc stream can be passed for now so
// this should do it
// const AUDIO_EXTENSIONS = /(\.mp3|\.wav|soundcloud.*)($|\?)/

export default class FilePlayer extends Base {
  static displayName = 'FilePlayer';
  static canPlay (url) {
    return VIDEO_EXTENSIONS.test(url) || AUDIO_EXTENSIONS.test(url)
  }
  componentDidMount () {
    this.player = this.refs.player
    this.player.oncanplay = this.onReady
    this.player.onplay = this.onPlay
    this.player.onpause = () => this.props.onPause()
    this.player.onended = () => this.props.onEnded()
    this.player.onerror = (e) => this.props.onError(e)
    this.player.setAttribute('webkit-playsinline', '')
    super.componentDidMount()
  }
  load (url) {
    this.player.src = url
  }
  play () {
    this.player.play()
  }
  pause () {
    this.player.pause()
  }
  stop () {
    this.player.src = ''
  }
  seekTo (fraction) {
    super.seekTo(fraction)
    this.player.currentTime = this.getDuration() * fraction
  }
  setVolume (fraction) {
    this.player.volume = fraction
  }
  getDuration () {
    if (!this.isReady) return null
    return this.player.duration
  }
  getFractionPlayed () {
    if (!this.isReady) return null
    return this.player.currentTime / this.getDuration()
  }
  getFractionLoaded () {
    if (!this.isReady || this.player.buffered.length === 0) return null
    return this.player.buffered.end(0) / this.getDuration()
  }
  render () {
    const Media = AUDIO_EXTENSIONS.test(this.props.url) ? 'audio' : 'video'
    const style = { display: this.props.url ? 'block' : 'none' }
    return (
      <Media
        className='filePlayer'
        ref='player'
        style={style}
        width='100%'
        height='100%'
        preload='auto'
      />
    )
  }
}
