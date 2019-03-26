import React from 'react'

import Player from './Player'
import { YouTube } from './players/YouTube'
import { SoundCloud } from './players/SoundCloud'
import { Vimeo } from './players/Vimeo'
import { DailyMotion } from './players/DailyMotion'

const PRELOAD_PLAYERS = [
  {
    Player: YouTube,
    configKey: 'youtube',
    url: 'https://www.youtube.com/watch?v=GlCmAC4MHek'
  },
  {
    Player: SoundCloud,
    configKey: 'soundcloud',
    url: 'https://soundcloud.com/seucheu/john-cage-433-8-bit-version'
  },
  {
    Player: Vimeo,
    configKey: 'vimeo',
    url: 'https://vimeo.com/300970506'
  },
  {
    Player: DailyMotion,
    configKey: 'dailymotion',
    url: 'http://www.dailymotion.com/video/xqdpyk'
  }
]

export default function renderPreloadPlayers (url, controls, config) {
  const players = []

  for (let player of PRELOAD_PLAYERS) {
    if (!player.Player.canPlay(url) && config[player.configKey].preload) {
      players.push(
        <Player
          key={player.Player.displayName}
          activePlayer={player.Player}
          url={player.url}
          controls={controls}
          playing
          muted
          style={{ display: 'none' }}
        />
      )
    }
  }

  return players
}
