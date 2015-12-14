import { Component } from 'react'

import propTypes from '../propTypes'

const UPDATE_FREQUENCY = 500

export default class Base extends Component {
  static propTypes = propTypes
  static defaultProps = {
    onProgress: function () {}
  }
  componentDidMount () {
    this.update()
  }
  componentWillUnmount () {
    this.stop()
    clearTimeout(this.updateTimeout)
  }
  componentWillReceiveProps (nextProps) {
    // Invoke player methods based on incoming props
    const canPlay = this.constructor.canPlay(nextProps.url);
    if ((this.props.url !== nextProps.url)) {
      if (canPlay) {
        this.play(nextProps.url)
        this.props.onProgress({ played: 0, loaded: 0 })
      } else {
        this.stop()
      }
    } else if ((!this.props.playing && nextProps.playing) && canPlay) {
      this.play(nextProps.url)
    } else if ((this.props.playing && !nextProps.playing) && canPlay) {
      this.pause()
    } else if (this.props.volume !== nextProps.volume) {
      this.setVolume(nextProps.volume)
    }
  }
  update = () => {
    let progress = {}
    const loaded = this.getFractionLoaded()
    const played = this.getFractionPlayed()
    if (!this.prevLoaded || loaded !== this.prevLoaded) {
      progress.loaded = this.prevLoaded = loaded
    }
    if (!this.prevPlayed || played !== this.prevPlayed) {
      progress.played = this.prevPlayed = played
    }
    if (progress.loaded || progress.played) {
      this.props.onProgress(progress)
    }
    this.updateTimeout = setTimeout(this.update, UPDATE_FREQUENCY)
  }
  onReady = () => {
    this.setVolume(this.props.volume)
    if (this.props.playing) {
      this.play()
    }
  }
}
