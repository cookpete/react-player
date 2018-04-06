import PropTypes from 'prop-types';
import React from 'react';
import ReactPlayer from '../ReactPlayer'

export default class MaestroPlayer extends React.Component {
  static propTypes = {
    refreshPlayer: PropTypes.func.isRequired,
    video: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }),
  };

  static defaultProps = {
    video: null,
  };

  state = {
    ready: false,
  };

  // End Player Controls
  componentWillUpdate(nextProps) {
    const { video: nextVideo } = nextProps;
    if (this.player) {
      this.player.seekTo(100);
    }
  }

  // player methods
  ref = (player) => {
    debugger;
    this.player = player;
  };

  // inital sync on Ready
  onReady = () => {
    debugger;
    const { video } = this.props;
    this.player.seekTo(video.offset);
    this.setState({
      ready: true,
    });
  };

  onPause = () => {
    this.wasPaused = true;
  };

  onPlay = () => {
    const { refreshPlayer } = this.props;
    if (this.wasPaused) {
      this.wasPaused = false;
      refreshPlayer();
    }
  };

  onEnded = () => {
    const { refreshPlayer } = this.props;
    refreshPlayer();
  };

  render() {
    const video = {
      url: 'https://mixer.com/embed/player/monstercat'
    }

    return (
      <React.Fragment>
        { video && <ReactPlayer
          ref={this.ref}
          controls
          height="100%"
          onEnded={this.onEnded}
          onPause={this.onPause}
          onPlay={this.onPlay}
          onReady={this.onReady}
          playing
          playsinline
          style={{
            left: 0,
            position: 'absolute',
            top: 0,
          }}
          url={video.url}
          width="100%"
        /> }
      </React.Fragment>
    );
  }
}
