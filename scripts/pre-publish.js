const { join } = require('path')
const { writeFile } = require('fs').promises
const { default: players } = require('../lib/players')

const generateSinglePlayers = async () => {
  for (const { key, name } of players) {
    const file = `
      var createReactPlayer = require('./lib/ReactPlayer').createReactPlayer
      var Player = require('./lib/players/${name}').default
      module.exports = createReactPlayer([{
        key: '${key}',
        canPlay: Player.canPlay,
        lazyPlayer: Player
      }])
    `
    await writeFile(join('.', `${key}.js`), file)
  }
}

generateSinglePlayers()
