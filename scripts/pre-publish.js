import { join } from 'path'
import { writeFile } from 'fs/promises'
import players from '../src/players/index.js'

const generateSinglePlayers = async () => {
  for (const { key, name } of players) {
    const file = `import { createReactPlayer } from './ReactPlayer.js'
import Player from './players/${name}.js'
export default createReactPlayer([{
  key: '${key}',
  canPlay: Player.canPlay,
  lazyPlayer: Player
}])
`
    await writeFile(join('./dist', `${key}.js`), file)
  }
}

generateSinglePlayers()
