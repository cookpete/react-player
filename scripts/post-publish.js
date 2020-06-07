const { join } = require('path')
const { unlink } = require('fs').promises
const { default: players } = require('../lib/players')

const deleteSinglePlayers = async () => {
  for (const { key } of players) {
    await unlink(join('.', `${key}.js`))
  }
}

deleteSinglePlayers()
