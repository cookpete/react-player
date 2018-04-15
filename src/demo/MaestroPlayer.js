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
          url: 'https://twitch.tv/monstercat'
        },
        ready: false
      })
    }, 2000)
    setTimeout(() => {
      this.setState({
        video: {
          offset: 102,
          spot: 'tv',
          url: 'https://twitch.tv/redbull'
        },
        ready: false
      })
    }, 1000)
  }
  // End Player Controls
  componentWillUpdate (nextProps) {
    if (this.player) {
      this.player.seekTo(100)
    }
  }

  // player methods
  ref = (player) => {
    console.log(player, 'PLAYER')
    this.player = player
    this.playerz = '1'
  };

  // inital sync on Ready
  onReady = () => {
    console.log('NO READY FIRED', '123')
    console.log(this.player, 'rrr', this.playerz)
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
    console.log(video, ready, 'STATE')
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
