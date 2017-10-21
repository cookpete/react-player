import React, { Component } from 'react'

import { preloadPlayers } from './players'

export default class PreloadPlayers extends Component {
  players = {}
  componentDidMount () {
    // extract preload logic from Player.js
    Object.values(this.players).forEach(player => {
      player.load(player.constructor.preloadURL)
    })
  }
  emptyFunction = () => {
    // errors preventing
  }
  // maybe Player - is better way to call absctration "one of players"?
  // see current file Player.js for more details of renaming
  renderPlayer = Player => {
    const { configName, displayName } = Player
    const { url, config } = this.props
    if (config[configName].preload && !Player.canPlay(url)) {
      return (
        <Player
          onPlay={this.emptyFunction}
          onPause={this.emptyFunction}
          onReady={this.emptyFunction}
          onEnded={this.emptyFunction}
          onError={this.emptyFunction}
          config={config}
          key={displayName}
          ref={this.ref}
          preloading
        />
      )
    }
    return null
  }
  ref = player => {
    if (!player) return // we needs for each preloadPlayer only once and can return
    const { displayName } = player.constructor
    this.players[displayName] = player
  }
  render () {
    return (
      <div style={{ display: 'none' }}>
        {preloadPlayers.map(this.renderPlayer)}
      </div>
    )
  }
}
