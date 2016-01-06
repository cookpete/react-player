import React from 'react'

import Base from './Base'

const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm)$/
const AUDIO_EXTENSIONS = /\.(mp3|wav)$/

export default class FilePlayer extends Base {
  static displayName = 'FilePlayer'
  static canPlay (url) {
    return VIDEO_EXTENSIONS.test(url) || AUDIO_EXTENSIONS.test(url)
  }
  componentDidMount () {
    this.player = this.refs.player
    this.player.oncanplay = this.onReady
    this.player.onplay = this.onPlay
    this.player.onpause = this.props.onPause
    this.player.onended = this.props.onEnded
    this.player.onerror = this.props.onError
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
    this.player.currentTime = this.player.duration * fraction
  }
  setVolume (fraction) {
    this.player.volume = fraction
  }
  getFractionPlayed () {
    if (!this.isReady) return null
    return this.player.currentTime / this.player.duration
  }
  getFractionLoaded () {
    if (!this.isReady || this.player.buffered.length === 0) return null
    return this.player.buffered.end(0) / this.player.duration
  }
  render () {
    const Media = AUDIO_EXTENSIONS.test(this.props.url) ? 'audio' : 'video'
    const style = { display: this.props.url ? 'block' : 'none' }
    return (
      <Media
        ref='player'
        style={style}
        width={this.props.width}
        height={this.props.height}
        preload='auto'
      />
    )
  }
}
