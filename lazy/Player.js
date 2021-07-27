"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));

var _props = require("./props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SEEK_ON_PLAY_EXPIRY = 5000;

var Player = /*#__PURE__*/function (_Component) {
  _inherits(Player, _Component);

  var _super = _createSuper(Player);

  function Player() {
    var _this;

    _classCallCheck(this, Player);

    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(_args));

    _defineProperty(_assertThisInitialized(_this), "mounted", false);

    _defineProperty(_assertThisInitialized(_this), "isReady", false);

    _defineProperty(_assertThisInitialized(_this), "isPlaying", false);

    _defineProperty(_assertThisInitialized(_this), "isLoading", true);

    _defineProperty(_assertThisInitialized(_this), "loadOnReady", null);

    _defineProperty(_assertThisInitialized(_this), "startOnPlay", true);

    _defineProperty(_assertThisInitialized(_this), "seekOnPlay", null);

    _defineProperty(_assertThisInitialized(_this), "onDurationCalled", false);

    _defineProperty(_assertThisInitialized(_this), "handlePlayerMount", function (player) {
      _this.player = player;

      _this.player.load(_this.props.url);

      _this.progress();
    });

    _defineProperty(_assertThisInitialized(_this), "getInternalPlayer", function (key) {
      if (!_this.player) return null;
      return _this.player[key];
    });

    _defineProperty(_assertThisInitialized(_this), "progress", function () {
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
          } // Only call onProgress if values have changed


          if (progress.playedSeconds !== _this.prevPlayed || progress.loadedSeconds !== _this.prevLoaded) {
            _this.props.onProgress(progress);
          }

          _this.prevPlayed = progress.playedSeconds;
          _this.prevLoaded = progress.loadedSeconds;
        }
      }

      _this.progressTimeout = setTimeout(_this.progress, _this.props.progressFrequency || _this.props.progressInterval);
    });

    _defineProperty(_assertThisInitialized(_this), "handleReady", function () {
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

      _this.handleDurationCheck();
    });

    _defineProperty(_assertThisInitialized(_this), "handlePlay", function () {
      _this.isPlaying = true;
      _this.isLoading = false;
      var _this$props2 = _this.props,
          onStart = _this$props2.onStart,
          onPlay = _this$props2.onPlay,
          playbackRate = _this$props2.playbackRate;

      if (_this.startOnPlay) {
        if (_this.player.setPlaybackRate && playbackRate !== 1) {
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

      _this.handleDurationCheck();
    });

    _defineProperty(_assertThisInitialized(_this), "handlePause", function (e) {
      _this.isPlaying = false;

      if (!_this.isLoading) {
        _this.props.onPause(e);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleEnded", function () {
      var _this$props3 = _this.props,
          activePlayer = _this$props3.activePlayer,
          loop = _this$props3.loop,
          onEnded = _this$props3.onEnded;

      if (activePlayer.loopOnEnded && loop) {
        _this.seekTo(0);
      }

      if (!loop) {
        _this.isPlaying = false;
        onEnded();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleError", function () {
      var _this$props4;

      _this.isLoading = false;

      (_this$props4 = _this.props).onError.apply(_this$props4, arguments);
    });

    _defineProperty(_assertThisInitialized(_this), "handleDurationCheck", function () {
      clearTimeout(_this.durationCheckTimeout);

      var duration = _this.getDuration();

      if (duration) {
        if (!_this.onDurationCalled) {
          _this.props.onDuration(duration);

          _this.onDurationCalled = true;
        }
      } else {
        _this.durationCheckTimeout = setTimeout(_this.handleDurationCheck, 100);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleLoaded", function () {
      // Sometimes we know loading has stopped but onReady/onPlay are never called
      // so this provides a way for players to avoid getting stuck
      _this.isLoading = false;
    });

    return _this;
  }

  _createClass(Player, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mounted = true;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this.progressTimeout);
      clearTimeout(this.durationCheckTimeout);

      if (this.isReady && this.props.stopOnUnmount) {
        this.player.stop();

        if (this.player.disablePIP) {
          this.player.disablePIP();
        }
      }

      this.mounted = false;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;

      // If there isn’t a player available, don’t do anything
      if (!this.player) {
        return;
      } // Invoke player methods based on changed props


      var _this$props5 = this.props,
          url = _this$props5.url,
          playing = _this$props5.playing,
          volume = _this$props5.volume,
          muted = _this$props5.muted,
          playbackRate = _this$props5.playbackRate,
          pip = _this$props5.pip,
          loop = _this$props5.loop,
          activePlayer = _this$props5.activePlayer;

      if (!(0, _reactFastCompare["default"])(prevProps.url, url)) {
        if (this.isLoading && !activePlayer.forceLoad) {
          console.warn("ReactPlayer: the attempt to load ".concat(url, " is being deferred until the player has loaded"));
          this.loadOnReady = url;
          return;
        }

        this.isLoading = true;
        this.startOnPlay = true;
        this.onDurationCalled = false;
        this.player.load(url, this.isReady);
      }

      if (!prevProps.playing && playing && !this.isPlaying) {
        this.player.play();
      }

      if (prevProps.playing && !playing && this.isPlaying) {
        this.player.pause();
      }

      if (!prevProps.pip && pip && this.player.enablePIP) {
        this.player.enablePIP();
      }

      if (prevProps.pip && !pip && this.player.disablePIP) {
        this.player.disablePIP();
      }

      if (prevProps.volume !== volume && volume !== null) {
        this.player.setVolume(volume);
      }

      if (prevProps.muted !== muted) {
        if (muted) {
          this.player.mute();
        } else {
          this.player.unmute();

          if (volume !== null) {
            // Set volume next tick to fix a bug with DailyMotion
            setTimeout(function () {
              return _this2.player.setVolume(volume);
            });
          }
        }
      }

      if (prevProps.playbackRate !== playbackRate && this.player.setPlaybackRate) {
        this.player.setPlaybackRate(playbackRate);
      }

      if (prevProps.loop !== loop && this.player.setLoop) {
        this.player.setLoop(loop);
      }
    }
  }, {
    key: "getDuration",
    value: function getDuration() {
      if (!this.isReady) return null;
      return this.player.getDuration();
    }
  }, {
    key: "getCurrentTime",
    value: function getCurrentTime() {
      if (!this.isReady) return null;
      return this.player.getCurrentTime();
    }
  }, {
    key: "getSecondsLoaded",
    value: function getSecondsLoaded() {
      if (!this.isReady) return null;
      return this.player.getSecondsLoaded();
    }
  }, {
    key: "seekTo",
    value: function seekTo(amount, type) {
      var _this3 = this;

      // When seeking before player is ready, store value and seek later
      if (!this.isReady && amount !== 0) {
        this.seekOnPlay = amount;
        setTimeout(function () {
          _this3.seekOnPlay = null;
        }, SEEK_ON_PLAY_EXPIRY);
        return;
      }

      var isFraction = !type ? amount > 0 && amount < 1 : type === 'fraction';

      if (isFraction) {
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
    key: "render",
    value: function render() {
      var Player = this.props.activePlayer;

      if (!Player) {
        return null;
      }

      return /*#__PURE__*/_react["default"].createElement(Player, _extends({}, this.props, {
        onMount: this.handlePlayerMount,
        onReady: this.handleReady,
        onPlay: this.handlePlay,
        onPause: this.handlePause,
        onEnded: this.handleEnded,
        onLoaded: this.handleLoaded,
        onError: this.handleError
      }));
    }
  }]);

  return Player;
}(_react.Component);

exports["default"] = Player;

_defineProperty(Player, "displayName", 'Player');

_defineProperty(Player, "propTypes", _props.propTypes);

_defineProperty(Player, "defaultProps", _props.defaultProps);