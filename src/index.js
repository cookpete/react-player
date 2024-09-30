import players from './players/index.js'
import { createReactPlayer } from './ReactPlayer.js'

// Fall back to FilePlayer if nothing else can play the URL
const fallback = players[players.length - 1]

export default createReactPlayer(players, fallback)
