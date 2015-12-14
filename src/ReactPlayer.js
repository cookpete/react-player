import React, { Component } from 'react'
import 'array.prototype.find'

import propTypes from './propTypes'
import players from './players'

const NO_OP = function () {}

export default class ReactPlayer extends Component {
  static propTypes = propTypes
  static defaultProps = {
    volume: 0.8,
    width: 640,
    height: 360,
    onPlay: NO_OP,
    onPause: NO_OP,
    onBuffer: NO_OP,
    onEnded: NO_OP
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
  renderPlayers () {
    return players.map(Player => {
      const canPlay = Player.canPlay(this.props.url);
      const style = {
        display: canPlay ? 'block' : 'none'
      }
      return (
        <div style={style} key={Player.name}>
          <Player ref={canPlay ? "player" : null} {...this.props} />
        </div>
      )
    })
  }
  render () {
    const Player = this.state.Player
    const style = {
      width: this.props.width,
      height: this.props.height,
      background: 'black'
    }
    return (
      <div style={style}>
        {this.renderPlayers()}
      </div>
    )
  }
}
