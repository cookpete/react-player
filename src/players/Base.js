import { Component } from 'react'

import { propTypes, defaultProps } from '../props'

const SEEK_ON_READY_EXPIRY = 5000

export default class Base extends Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
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
      this.load(nextProps.url, nextProps.playing)
      this.seekOnReady = null
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
  isReady = false;
  seekTo (fraction) {
    // When seeking before player is ready, store value and seek later
    if (!this.isReady && fraction !== 0) {
      this.seekOnReady = fraction
      setTimeout(() => this.seekOnReady = null, SEEK_ON_READY_EXPIRY)
    }
  }
  onPlay = () => {
    this.props.onPlay()
    this.setVolume(this.props.volume)
    if (this.seekOnReady) {
      this.seekTo(this.seekOnReady)
      this.seekOnReady = null
    }
  };
  onReady = () => {
    this.isReady = true
    if (this.props.playing || this.preloading) {
      this.preloading = false
      if (this.loadOnReady) {
        this.load(this.loadOnReady, this.props.playing)
        this.loadOnReady = null
      } else {
        this.play()
      }
    }
  };
}
