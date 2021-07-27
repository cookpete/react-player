
      const createReactPlayer = require('./lib/ReactPlayer').createReactPlayer
      const Player = require('./lib/players/Kaltura').default
      module.exports = createReactPlayer([{
        key: 'kaltura',
        canPlay: Player.canPlay,
        lazyPlayer: Player
      }])
    