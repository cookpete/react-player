'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _props2 = require('./props');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SEEK_ON_PLAY_EXPIRY = 5000;

var Player = function (_Component) {
  _inherits(Player, _Component);

  function Player() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Player);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Player.__proto__ || Object.getPrototypeOf(Player)).call.apply(_ref, [this].concat(args))), _this), _this.mounted = false, _this.isReady = false, _this.isPlaying = false, _this.isLoading = true, _this.loadOnReady = null, _this.startOnPlay = true, _this.seekOnPlay = null, _this.onDurationCalled = false, _this.getInternalPlayer = function (key) {
      if (!_this.player) return null;
      return _this.player[key];
    }, _this.progress = function () {
      if (_this.props.url && _this.player && _this.isReady) {
        var playedSeconds = _this.getCurrentTime() || 0;
        var loadedSeconds = _this.getSecondsLoaded();
        var duration = _this.getDuration();
        if (duration) {
          var progress = {
            playedSeconds: playedSeconds,
            played: playedSeconds / duration
          };
          if (loadedSeconds !== null) {
            progress.loadedSeconds = loadedSeconds;
            progress.loaded = loadedSeconds / duration;
          }
          // Only call onProgress if values have changed
          if (progress.played !== _this.prevPlayed || progress.loaded !== _this.prevLoaded) {
            _this.props.onProgress(progress);
          }
          _this.prevPlayed = progress.played;
          _this.prevLoaded = progress.loaded;
        }
      }
      _this.progressTimeout = setTimeout(_this.progress, _this.props.progressFrequency || _this.props.progressInterval);
    }, _this.onReady = function () {
      if (!_this.mounted) return;
      _this.isReady = true;
      _this.isLoading = false;
      var _this$props = _this.props,
          onReady = _this$props.onReady,
          playing = _this$props.playing,
          volume = _this$props.volume,
          muted = _this$props.muted;

      onReady();
      if (!muted && volume !== null) {
        _this.player.setVolume(volume);
      }
      if (_this.loadOnReady) {
        _this.player.load(_this.loadOnReady, true);
        _this.loadOnReady = null;
      } else if (playing) {
        _this.player.play();
      }
      _this.onDurationCheck();
    }, _this.onPlay = function () {
      _this.isPlaying = true;
      _this.isLoading = false;
      var _this$props2 = _this.props,
          onStart = _this$props2.onStart,
          onPlay = _this$props2.onPlay,
          playbackRate = _this$props2.playbackRate;

      if (_this.startOnPlay) {
        if (_this.player.setPlaybackRate) {
          _this.player.setPlaybackRate(playbackRate);
        }
        onStart();
        _this.startOnPlay = false;
      }
      onPlay();
      if (_this.seekOnPlay) {
        _this.seekTo(_this.seekOnPlay);
        _this.seekOnPlay = null;
      }
      _this.onDurationCheck();
    }, _this.onPause = function (e) {
      _this.isPlaying = false;
      if (!_this.isLoading) {
        _this.props.onPause(e);
      }
    }, _this.onEnded = function () {
      var _this$props3 = _this.props,
          activePlayer = _this$props3.activePlayer,
          loop = _this$props3.loop,
          onEnded = _this$props3.onEnded;

      if (activePlayer.loopOnEnded && loop) {
        _this.seekTo(0);
      }
      if (!loop) {
        _this.isPlaying = false;
      }
      onEnded();
    }, _this.onDurationCheck = function () {
      clearTimeout(_this.durationCheckTimeout);
      var duration = _this.getDuration();
      if (duration) {
        if (!_this.onDurationCalled) {
          _this.props.onDuration(duration);
          _this.onDurationCalled = true;
        }
      } else {
        _this.durationCheckTimeout = setTimeout(_this.onDurationCheck, 100);
      }
    }, _this.onLoaded = function () {
      // Sometimes we know loading has stopped but onReady/onPlay are never called
      // so this provides a way for players to avoid getting stuck
      _this.isLoading = false;
    }, _this.ref = function (player) {
      if (player) {
        _this.player = player;
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  } // Track playing state internally to prevent bugs
  // Use isLoading to prevent onPause when switching URL


  _createClass(Player, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.mounted = true;
      this.player.load(this.props.url);
      this.progress();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.progressTimeout);
      clearTimeout(this.durationCheckTimeout);
      if (this.isReady) {
        this.player.stop();
      }
      this.mounted = false;
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      // Invoke player methods based on incoming props
      var _props = this.props,
          url = _props.url,
          playing = _props.playing,
          volume = _props.volume,
          muted = _props.muted,
          playbackRate = _props.playbackRate;

      if (!(0, _utils.isEqual)(url, nextProps.url)) {
        if (this.isLoading) {
          console.warn('ReactPlayer: the attempt to load ' + nextProps.url + ' is being deferred until the player has loaded');
          this.loadOnReady = nextProps.url;
          return;
        }
        this.isLoading = true;
        this.startOnPlay = true;
        this.onDurationCalled = false;
        this.player.load(nextProps.url, this.isReady);
      }
      if (!playing && nextProps.playing && !this.isPlaying) {
        this.player.play();
      }
      if (playing && !nextProps.playing && this.isPlaying) {
        this.player.pause();
      }
      if (volume !== nextProps.volume && nextProps.volume !== null) {
        this.player.setVolume(nextProps.volume);
      }
      if (muted !== nextProps.muted) {
        if (nextProps.muted) {
          this.player.mute();
        } else {
          this.player.unmute();
          if (nextProps.volume !== null) {
            // Set volume next tick to fix a bug with DailyMotion
            setTimeout(function () {
              return _this2.player.setVolume(nextProps.volume);
            });
          }
        }
      }
      if (playbackRate !== nextProps.playbackRate && this.player.setPlaybackRate) {
        this.player.setPlaybackRate(nextProps.playbackRate);
      }
    }
  }, {
    key: 'getDuration',
    value: function getDuration() {
      if (!this.isReady) return null;
      return this.player.getDuration();
    }
  }, {
    key: 'getCurrentTime',
    value: function getCurrentTime() {
      if (!this.isReady) return null;
      return this.player.getCurrentTime();
    }
  }, {
    key: 'getSecondsLoaded',
    value: function getSecondsLoaded() {
      if (!this.isReady) return null;
      return this.player.getSecondsLoaded();
    }
  }, {
    key: 'seekTo',
    value: function seekTo(amount) {
      var _this3 = this;

      // When seeking before player is ready, store value and seek later
      if (!this.isReady && amount !== 0) {
        this.seekOnPlay = amount;
        setTimeout(function () {
          _this3.seekOnPlay = null;
        }, SEEK_ON_PLAY_EXPIRY);
        return;
      }
      if (amount > 0 && amount < 1) {
        // Convert fraction to seconds based on duration
        var duration = this.player.getDuration();
        if (!duration) {
          console.warn('ReactPlayer: could not seek using fraction – duration not yet available');
          return;
        }
        this.player.seekTo(duration * amount);
        return;
      }
      this.player.seekTo(amount);
    }
  }, {
    key: 'render',
    value: function render() {
      var Player = this.props.activePlayer;
      if (!Player) {
        return null;
      }
      return _react2['default'].createElement(Player, _extends({}, this.props, {
        ref: this.ref,
        onReady: this.onReady,
        onPlay: this.onPlay,
        onPause: this.onPause,
        onEnded: this.onEnded,
        onLoaded: this.onLoaded
      }));
    }
  }]);

  return Player;
}(_react.Component);

Player.displayName = 'Player';
Player.propTypes = _props2.propTypes;
Player.defaultProps = _props2.defaultProps;
exports['default'] = Player;