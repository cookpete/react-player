import PropTypes from 'prop-types'
import React from 'react'
import ReactPlayer from '../ReactPlayer'

export default class MaestroPlayer extends React.Component {
  static propTypes = {
    refreshPlayer: PropTypes.func.isRequired,
    video: PropTypes.shape({
      url: PropTypes.string.isRequired
    })
  };

  static defaultProps = {
    video: null
  };

  state = {
    video: null,
    ready: false
  };
  componentDidMount () {
    setTimeout(() => {
      this.setState({
        video: {
          offset: 102,
          spot: 'tv',
          url: 'VAST:https://bs.serving-sys.com/Serving?cn=display&c=23&pl=VAST&pli=25235872&PluID=0&pos=7996&ord=%5Btimestamp%5D&cim=1'
        },
        ready: false
      })
    }, 2000)
  }
  // End Player Controls
  componentWillUpdate (nextProps) {
    if (this.player) {
      this.player.seekTo(100)
    }
  }

  // player methods
  ref = (player) => {
    this.player = player
    this.playerz = '1'
  };

  // inital sync on Ready
  onReady = () => {
    const { video } = this.state
    this.player.seekTo(video.offset)
    this.setState({
      ready: true
    })
  };

  onPause = () => {
    this.wasPaused = true
  };

  onPlay = () => {
    const { refreshPlayer } = this.props
    if (this.wasPaused) {
      this.wasPaused = false
      refreshPlayer()
    }
  };

  onEnded = () => {
    const { refreshPlayer } = this.props
    refreshPlayer()
  };

  render () {
    const { ready, video } = this.state
    return (
      <React.Fragment>
        { video && <ReactPlayer
          ref={this.ref}
          controls
          height='100%'
          onEnded={this.onEnded}
          onPause={this.onPause}
          onPlay={this.onPlay}
          onReady={this.onReady}
          playing
          playsinline
          style={{
            left: 0,
            position: 'absolute',
            top: 0
          }}
          url={video.url}
          width='100%'
        /> }
        { !ready && <div> loading </div> }
      </React.Fragment>
    )
  }
}
