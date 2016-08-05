import { Component } from 'react'

import { propTypes, defaultProps } from '../props'

const SEEK_ON_PLAY_EXPIRY = 5000

export default class Base extends Component {
  static propTypes = propTypes
  static defaultProps = defaultProps
  isReady = false
  startOnPlay = true
  durationOnPlay = false
  seekOnPlay = null
  componentDidMount () {
    const { url } = this.props
    this.mounted = true
    if (url) {
      this.load(url)
    }
  }
  componentWillUnmount () {
    this.stop()
    this.mounted = false
  }
  componentWillReceiveProps (nextProps) {
    const { url, playing, volume, playbackRate } = this.props
    // Invoke player methods based on incoming props
    if (url !== nextProps.url && nextProps.url) {
      this.seekOnPlay = null
      this.startOnPlay = true
      this.load(nextProps.url)
    } else if (url && !nextProps.url) {
      this.stop()
      clearTimeout(this.updateTimeout)
    } else if (!playing && nextProps.playing) {
      this.play()
    } else if (playing && !nextProps.playing) {
      this.pause()
    } else if (volume !== nextProps.volume) {
      this.setVolume(nextProps.volume)
    } else if (playbackRate !== nextProps.playbackRate) {
      this.setPlaybackRate(nextProps.playbackRate)
    }
  }
  shouldComponentUpdate (nextProps) {
    return this.props.url !== nextProps.url
  }
  seekTo (fraction) {
    // When seeking before player is ready, store value and seek later
    if (!this.isReady && fraction !== 0) {
      this.seekOnPlay = fraction
      setTimeout(() => {
        this.seekOnPlay = null
      }, SEEK_ON_PLAY_EXPIRY)
    }
  }
  onPlay = () => {
    const { volume, onStart, onPlay, onDuration, playbackRate } = this.props
    if (this.startOnPlay) {
      this.setPlaybackRate(playbackRate)
      this.setVolume(volume)
      onStart()
      this.startOnPlay = false
    }
    onPlay()
    if (this.seekOnPlay) {
      this.seekTo(this.seekOnPlay)
      this.seekOnPlay = null
    }
    if (this.durationOnPlay) {
      onDuration(this.getDuration())
      this.durationOnPlay = false
    }
  }
  onReady = () => {
    const { onReady, playing, onDuration } = this.props
    this.isReady = true
    this.loadingSDK = false
    onReady()
    if (playing || this.preloading) {
      this.preloading = false
      if (this.loadOnReady) {
        this.load(this.loadOnReady)
        this.loadOnReady = null
      } else {
        this.play()
      }
    }
    const duration = this.getDuration()
    if (duration) {
      onDuration(duration)
    } else {
      this.durationOnPlay = true
    }
  }
}
