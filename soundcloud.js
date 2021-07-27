
      const createReactPlayer = require('./lib/ReactPlayer').createReactPlayer
      const Player = require('./lib/players/SoundCloud').default
      module.exports = createReactPlayer([{
        key: 'soundcloud',
        canPlay: Player.canPlay,
        lazyPlayer: Player
      }])
    