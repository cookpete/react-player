
      const createReactPlayer = require('./lib/ReactPlayer').createReactPlayer
      const Player = require('./lib/players/Twitch').default
      module.exports = createReactPlayer([{
        key: 'twitch',
        canPlay: Player.canPlay,
        lazyPlayer: Player
      }])
    