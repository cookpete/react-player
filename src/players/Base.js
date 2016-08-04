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
    if (this.props.url) {
      this.load(this.props.url)
    }
  }
  componentWillUnmount () {
    this.stop()
  }
  componentWillReceiveProps (nextProps) {
    // Invoke player methods based on incoming props
    if (this.props.url !== nextProps.url && nextProps.url) {
      this.seekOnPlay = null
      this.startOnPlay = true
      this.load(nextProps.url)
    } else if (this.props.url && !nextProps.url) {
      this.stop()
      clearTimeout(this.updateTimeout)
    } else if (!this.props.playing && nextProps.playing) {
      this.play()
    } else if (this.props.playing && !nextProps.playing) {
      this.pause()
    } else if (this.props.volume !== nextProps.volume) {
      this.setVolume(nextProps.volume)
    }
  }
  shouldComponentUpdate (nextProps) {
    return this.props.url !== nextProps.url
  }
  seekTo (fraction) {
    // When seeking before player is ready, store value and seek later
    if (!this.isReady && fraction !== 0) {
      this.seekOnPlay = fraction
      setTimeout(() => { this.seekOnPlay = null }, SEEK_ON_PLAY_EXPIRY)
    }
  }
  onPlay = () => {
    if (this.startOnPlay) {
      this.setVolume(this.props.volume)
      this.props.onStart()
      this.startOnPlay = false
    }
    this.props.onPlay()
    if (this.seekOnPlay) {
      this.seekTo(this.seekOnPlay)
      this.seekOnPlay = null
    }
    if (this.durationOnPlay) {
      this.props.onDuration(this.getDuration())
      this.durationOnPlay = false
    }
  }
  onReady = () => {
    this.isReady = true
    if (this.props.playing || this.preloading) {
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
      this.props.onDuration(duration)
    } else {
      this.durationOnPlay = true
    }
  }
}
