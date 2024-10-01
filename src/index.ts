'use client';

import players from './players.js';
import { createReactPlayer } from './ReactPlayer.js';

// Fall back to FilePlayer if nothing else can play the URL
const fallback = players[players.length - 1];

export default createReactPlayer(players, fallback);
