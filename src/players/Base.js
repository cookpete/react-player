import { Component } from 'react'

import { propTypes, defaultProps } from '../props'

export default class Base extends Component {
  static propTypes = propTypes
  static defaultProps = defaultProps
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
      this.props.onProgress({ played: 0, loaded: 0 }) // Needed?
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
  isReady = false
  onReady = () => {
    this.setVolume(this.props.volume)
    if (this.props.playing || this.preloading) {
      this.preloading = false
      this.isReady = true
      this.play()
    }
  }
}
