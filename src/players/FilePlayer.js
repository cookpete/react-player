import React from 'react'

import propTypes from '../propTypes'
import Base from './Base'

const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm)$/
const AUDIO_EXTENSIONS = /\.(mp3|wav)$/

export default class FilePlayer extends Base {
  static propTypes = propTypes
  static canPlay (url) {
    return VIDEO_EXTENSIONS.test(url) || AUDIO_EXTENSIONS.test(url)
  }
  componentDidMount () {
    this.player = this.refs.player
    this.player.oncanplay = this.onReady
    this.player.onplay = this.props.onPlay
    this.player.onpause = this.props.onPause
    this.player.onended = this.props.onEnded
    this.player.onerror = this.props.onError
    super.componentDidMount()
  }
  shouldComponentUpdate (nextProps) {
    return this.props.url !== nextProps
  }
  play (url) {
    this.player.play()
  }
  pause () {
    this.player.pause()
  }
  stop () {
    // No need to stop
  }
  seekTo (fraction) {
    this.player.currentTime = this.player.duration * fraction
  }
  setVolume (fraction) {
    this.player.volume = fraction
  }
  getFractionPlayed () {
    if (this.player.readyState === 0) return 0
    return this.player.currentTime / this.player.duration
  }
  getFractionLoaded () {
    if (this.player.readyState === 0) return 0
    return this.player.buffered.end(0) / this.player.duration
  }
  render () {
    const Media = AUDIO_EXTENSIONS.test(this.props.url) ? 'audio' : 'video'
    return (
      <Media
        ref='player'
        src={this.props.url}
        width={this.props.width}
        height={this.props.height}
      />
    )
  }
}
