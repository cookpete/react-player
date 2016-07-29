import React from 'react'

import Base from './Base'

const AUDIO_EXTENSIONS = /\.(mp3|wav|m4a)($|\?)/i

export default class FilePlayer extends Base {
  static displayName = 'FilePlayer'
  static canPlay (url) {
    return true
  }
  componentDidMount () {
    this.player = this.refs.player
    this.player.oncanplay = this.onReady
    this.player.onplay = this.onPlay
    this.player.onpause = () => this.props.onPause()
    this.player.onended = () => this.onEnded()
    this.player.onerror = e => this.props.onError(e)
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
    this.pause()
    this.player.removeAttribute('src')
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
    const { controls, fileConfig } = this.props
    const Media = AUDIO_EXTENSIONS.test(this.props.url) ? 'audio' : 'video'
    const style = {
      width: '100%',
      height: '100%',
      display: this.props.url ? 'block' : 'none'
    }
    return (
      <Media
        ref='player'
        style={style}
        preload='auto'
        controls={controls}
        {...fileConfig.attributes}
      />
    )
  }
}
