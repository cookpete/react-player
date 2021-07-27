
      const createReactPlayer = require('./lib/ReactPlayer').createReactPlayer
      const Player = require('./lib/players/FilePlayer').default
      module.exports = createReactPlayer([{
        key: 'file',
        canPlay: Player.canPlay,
        lazyPlayer: Player
      }])
    