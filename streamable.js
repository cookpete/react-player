
      const createReactPlayer = require('./lib/ReactPlayer').createReactPlayer
      const Player = require('./lib/players/Streamable').default
      module.exports = createReactPlayer([{
        key: 'streamable',
        canPlay: Player.canPlay,
        lazyPlayer: Player
      }])
    