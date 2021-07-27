
      const createReactPlayer = require('./lib/ReactPlayer').createReactPlayer
      const Player = require('./lib/players/Facebook').default
      module.exports = createReactPlayer([{
        key: 'facebook',
        canPlay: Player.canPlay,
        lazyPlayer: Player
      }])
    