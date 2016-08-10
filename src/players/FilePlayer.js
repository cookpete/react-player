import React from 'react'
import Base from './Base'

const AUDIO_EXTENSIONS = /\.(mp3|wav|m4a)($|\?)/i

export default class FilePlayer extends Base {
  static displayName = 'FilePlayer'
  static canPlay (url) {
    return true
  }
  static defaultProps = Object.assign({
    startOffset: 0
  }, Base.defaultProps)
  constructor (props) {
    super(props)
    this.state = Object.assign({
      startOffset: 0
    }, this.state)
  }
  componentWillReceiveProps ({ startOffset }) {
    super.componentWillReceiveProps(...arguments)
    if (startOffset !== this.props.startOffset) {
      const duration = this.player.duration - startOffset
      this.safelyUpdateStartOffset(startOffset)
      if (duration > 0) {
        const newFraction = Math.max(0, this.player.currentTime - startOffset) / duration
        super.seekTo(newFraction)
        this.player.currentTime = duration * newFraction + startOffset
      }
    }
  }
  componentDidMount () {
    this.player = this.refs.player
    this.player.oncanplay = this.onReady
    this.player.onplay = this.onPlay
    this.player.onpause = () => this.props.onPause()
    this.player.onended = () => this.props.onEnded()
    this.player.onerror = e => this.props.onError(e)
    this.player.setAttribute('webkit-playsinline', '')
    this.player.addEventListener('loadedmetadata', this.onLoadedMetaData)
    super.componentDidMount()
  }
  shouldComponentUpdate ({ startOffset }) {
    return super.shouldComponentUpdate(...arguments) || startOffset !== this.props.startOffset
  }
  onLoadedMetaData = () => {
    this.safelyUpdateStartOffset(this.props.startOffset)
  }
  safelyUpdateStartOffset = (startOffset) => {
    if (startOffset < 0) {
      this.setState({
        startOffset: 0
      })
      console.warn("Cannot set `startOffset` to a negative value. `startOffset` falls back to it's default (0).")
    } else if (this.player.duration > startOffset) {
      this.setState({
        startOffset: startOffset || 0
      })
    } else {
      this.setState({
        startOffset: 0
      })
      console.warn("Cannot set `startOffset` to a value superior to media's `duration`. `startOffset` falls back to it's default (0).")
    }
  }
  load (url) {
    this.player.src = url
  }
  play () {
    this.player.play()
    if (this.player.currentTime < this.state.startOffset) this.seekTo(0)
  }
  pause () {
    this.player.pause()
  }
  stop () {
    this.pause()
    this.player.removeAttribute('src')
  }
  seekTo (fraction) {
    const { startOffset } = this.state
    super.seekTo(fraction)
    this.player.currentTime = this.getDuration() * fraction + startOffset
  }
  setVolume (fraction) {
    this.player.volume = fraction
  }
  getDuration () {
    const { startOffset } = this.state
    if (!this.isReady) return null
    return this.player.duration - startOffset
  }
  getFractionPlayed () {
    const { startOffset } = this.state
    if (!this.isReady) return null
    return (this.player.currentTime - startOffset) / this.getDuration()
  }
  getFractionLoaded () {
    if (!this.isReady || this.player.buffered.length === 0) return null
    return Math.min(this.player.buffered.end(0) / this.getDuration(), 1)
  }
  render () {
    const { loop, controls, fileConfig } = this.props
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
        loop={loop}
        {...fileConfig.attributes}
      />
    )
  }
}
