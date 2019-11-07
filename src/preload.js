import React from 'react'
import players from './players'
import Player from './Player'

export default function renderPreloadPlayers (url, controls, config) {
  const preloadPlayers = []

  for (const player of players) {
    if (player.preloadUrl && config[player.configKey].preload && !player.canPlay(url)) {
      preloadPlayers.push(
        <Player
          key={player.configKey}
          activePlayer={player.Player}
          url={player.preloadUrl}
          controls={controls}
          playing
          muted
          display='none'
        />
      )
    }
  }

  return preloadPlayers
}
