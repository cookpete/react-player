
      const createReactPlayer = require('./lib/ReactPlayer').createReactPlayer
      const Player = require('./lib/players/Vidyard').default
      module.exports = createReactPlayer([{
        key: 'vidyard',
        canPlay: Player.canPlay,
        lazyPlayer: Player
      }])
    