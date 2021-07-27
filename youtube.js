
      const createReactPlayer = require('./lib/ReactPlayer').createReactPlayer
      const Player = require('./lib/players/YouTube').default
      module.exports = createReactPlayer([{
        key: 'youtube',
        canPlay: Player.canPlay,
        lazyPlayer: Player
      }])
    