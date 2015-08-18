import { Component, PropTypes } from 'react'

const UPDATE_FREQUENCY = 500

export default class Base extends Component {
  static propTypes = {
    url: PropTypes.string,
    playing: PropTypes.bool,
    volume: PropTypes.number,
    width: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    height: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
    onBuffer: PropTypes.func,
    onEnded: PropTypes.func,
    onError: PropTypes.func
  }
  static defaultProps = {
    onProgress: function () {}
  }
  componentDidMount () {
    this.play(this.props.url)
    this.update()
  }
  componentWillUnmount () {
    this.stop()
    clearTimeout(this.updateTimeout)
  }
  componentWillReceiveProps (nextProps) {
    // Invoke player methods based on incoming props
    if (this.props.url !== nextProps.url) {
      this.play(nextProps.url)
      this.onProgress({ played: 0, loaded: 0 })
    } else if (!this.props.playing && nextProps.playing) {
      this.play()
    } else if (this.props.playing && !nextProps.playing) {
      this.pause()
    } else if (this.props.volume !== nextProps.volume) {
      this.setVolume(nextProps.volume)
    }
  }
  update = () => {
    let progress = {}
    let loaded = this.getFractionLoaded()
    let played = this.getFractionPlayed()
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
}
