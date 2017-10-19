import React, { Component } from 'react'

import Player from './Player'
import YouTube from './players/YouTube'
import Vimeo from './players/Vimeo'
import DailyMotion from './players/DailyMotion'

export default class PreloadPlayers extends Component {
  renderPreloadPlayer = activePlayer => {
    return (
      <Player
        key={activePlayer.displayName}
        config={this.props.config}
        activePlayer={activePlayer}
      />
    )
  }
  render () {
    const { url, config } = this.props

    const players = []
    if (!YouTube.canPlay(url) && config.youtube.preload) {
      players.push(YouTube)
    }
    if (!Vimeo.canPlay(url) && config.vimeo.preload) {
      players.push(Vimeo)
    }
    if (!DailyMotion.canPlay(url) && config.dailymotion.preload) {
      players.push(DailyMotion)
    }

    if (players.length === 0) {
      return null
    }

    return (
      <div style={{ display: 'none' }}>
        {players.map(this.renderPreloadPlayer)}
      </div>
    )
  }
}
