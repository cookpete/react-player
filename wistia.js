
      const createReactPlayer = require('./lib/ReactPlayer').createReactPlayer
      const Player = require('./lib/players/Wistia').default
      module.exports = createReactPlayer([{
        key: 'wistia',
        canPlay: Player.canPlay,
        lazyPlayer: Player
      }])
    