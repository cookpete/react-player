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
  shouldComponentUpdate (nextProps) {
    return (
      this.props.url !== nextProps.url ||
      this.props.playing !== nextProps.playing ||
      this.props.volume !== nextProps.volume
    )
  }
  seekTo = fraction => {
    const player = this.refs.player
    if (player) {
      player.seekTo(fraction)
    }
  }
  renderPlayer = Player => {
    const active = Player.canPlay(this.props.url)
    const props = active ? { ...this.props, ref: 'player' } : {}
    return <Player key={Player.name} {...props} />
  }
  render () {
    const style = {
      width: this.props.width,
      height: this.props.height
    }
    return (
      <div style={style}>
        { players.map(this.renderPlayer) }
      </div>
    )
  }
}
