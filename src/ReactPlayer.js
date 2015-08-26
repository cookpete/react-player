import React, { Component } from 'react'
import 'array.prototype.find'

import propTypes from './propTypes'
import players from './players'

export default class MediaPlayer extends Component {
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
    Player: null
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.url !== nextProps.url) {
      this.setState({
        Player: players.find(Player => Player.canPlay(nextProps.url))
      })
    }
  }
  seekTo = fraction => {
    let player = this.refs.player
    if (player) {
      player.seekTo(fraction)
    }
  }
  render () {
    let Player = this.state.Player
    let style = {
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
