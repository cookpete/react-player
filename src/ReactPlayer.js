import React, { Component } from 'react'
import 'array.prototype.find'

import propTypes from './propTypes'
import players from './players'

export default class ReactPlayer extends Component {
  static propTypes = propTypes
  static defaultProps = {
    volume: 0.8,
    width: 640,
    height: 360,
    onPlay: function () {}, // TODO: Empty func var in react?
    onPause: function () {},
    onBuffer: function () {},
    onEnded: function () {}
  }
  static canPlay (url) {
    return players.some(player => player.canPlay(url))
  }
  state = {
    Player: this.getPlayer(this.props.url)
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.url !== nextProps.url) {
      this.setState({
        Player: this.getPlayer(nextProps.url)
      })
    }
  }
  getPlayer (url) {
    return players.find(Player => Player.canPlay(url))
  }
  seekTo = fraction => {
    const player = this.refs.player
    if (player) {
      player.seekTo(fraction)
    }
  }
  render () {
    const Player = this.state.Player
    const style = {
      width: this.props.width,
      height: this.props.height
    }
    return (
      <div style={style}>
        { Player && <Player ref='player' {...this.props} /> }
      </div>
    )
  }
}
