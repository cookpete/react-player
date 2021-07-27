
      const createReactPlayer = require('./lib/ReactPlayer').createReactPlayer
      const Player = require('./lib/players/Vimeo').default
      module.exports = createReactPlayer([{
        key: 'vimeo',
        canPlay: Player.canPlay,
        lazyPlayer: Player
      }])
    