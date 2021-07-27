
      const createReactPlayer = require('./lib/ReactPlayer').createReactPlayer
      const Player = require('./lib/players/Mixcloud').default
      module.exports = createReactPlayer([{
        key: 'mixcloud',
        canPlay: Player.canPlay,
        lazyPlayer: Player
      }])
    