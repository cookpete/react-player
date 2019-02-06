'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilePlayer = exports.Mixcloud = exports.DailyMotion = exports.Twitch = exports.Wistia = exports.Streamable = exports.Facebook = exports.Vimeo = exports.SoundCloud = exports.YouTube = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _YouTube = require('./players/YouTube');

Object.defineProperty(exports, 'YouTube', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_YouTube)['default'];
  }
});

var _SoundCloud = require('./players/SoundCloud');

Object.defineProperty(exports, 'SoundCloud', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SoundCloud)['default'];
  }
});

var _Vimeo = require('./players/Vimeo');

Object.defineProperty(exports, 'Vimeo', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Vimeo)['default'];
  }
});

var _Facebook = require('./players/Facebook');

Object.defineProperty(exports, 'Facebook', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Facebook)['default'];
  }
});

var _Streamable = require('./players/Streamable');

Object.defineProperty(exports, 'Streamable', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Streamable)['default'];
  }
});

var _Wistia = require('./players/Wistia');

Object.defineProperty(exports, 'Wistia', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Wistia)['default'];
  }
});

var _Twitch = require('./players/Twitch');

Object.defineProperty(exports, 'Twitch', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Twitch)['default'];
  }
});

var _DailyMotion = require('./players/DailyMotion');

Object.defineProperty(exports, 'DailyMotion', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DailyMotion)['default'];
  }
});

var _Mixcloud = require('./players/Mixcloud');

Object.defineProperty(exports, 'Mixcloud', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Mixcloud)['default'];
  }
});

var _FilePlayer = require('./players/FilePlayer');

Object.defineProperty(exports, 'FilePlayer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_FilePlayer)['default'];
  }
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _props2 = require('./props');

var _utils = require('./utils');

var _players = require('./players');

var _players2 = _interopRequireDefault(_players);

var _Player4 = require('./Player');

var _Player5 = _interopRequireDefault(_Player4);

var _Preview = require('./Preview');

var _Preview2 = _interopRequireDefault(_Preview);

var _preload = require('./preload');

var _preload2 = _interopRequireDefault(_preload);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SUPPORTED_PROPS = Object.keys(_props2.propTypes);

var customPlayers = [];

var ReactPlayer = function (_Component) {
  _inherits(ReactPlayer, _Component);

  function ReactPlayer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ReactPlayer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReactPlayer.__proto__ || Object.getPrototypeOf(ReactPlayer)).call.apply(_ref, [this].concat(args))), _this), _this.config = (0, _utils.getConfig)(_this.props, _props2.defaultProps, true), _this.state = {
      showPreview: !!_this.props.light
    }, _this.onClickPreview = function () {
      _this.setState({ showPreview: false });
    }, _this.getDuration = function () {
      if (!_this.player) return null;
      return _this.player.getDuration();
    }, _this.getCurrentTime = function () {
      if (!_this.player) return null;
      return _this.player.getCurrentTime();
    }, _this.getSecondsLoaded = function () {
      if (!_this.player) return null;
      return _this.player.getSecondsLoaded();
    }, _this.getInternalPlayer = function () {
      var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'player';

      if (!_this.player) return null;
      return _this.player.getInternalPlayer(key);
    }, _this.seekTo = function (fraction) {
      if (!_this.player) return null;
      _this.player.seekTo(fraction);
    }, _this.onReady = function () {
      _this.props.onReady(_this);
    }, _this.wrapperRef = function (wrapper) {
      _this.wrapper = wrapper;
    }, _this.activePlayerRef = function (player) {
      _this.player = player;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ReactPlayer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.progressFrequency) {
        var message = 'ReactPlayer: %cprogressFrequency%c is deprecated, please use %cprogressInterval%c instead';
        console.warn(message, 'font-weight: bold', '', 'font-weight: bold', '');
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utils.isEqual)(this.props, nextProps) || !(0, _utils.isEqual)(this.state, nextState);
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      this.config = (0, _utils.getConfig)(nextProps, _props2.defaultProps);
      if (!this.props.light && nextProps.light) {
        this.setState({ showPreview: true });
      }
    }
  }, {
    key: 'getActivePlayer',
    value: function getActivePlayer(url) {
      var _arr = [].concat(_toConsumableArray(customPlayers), _toConsumableArray(_players2['default']));

      for (var _i = 0; _i < _arr.length; _i++) {
        var _Player = _arr[_i];
        if (_Player.canPlay(url)) {
          return _Player;
        }
      }
      // Fall back to FilePlayer if nothing else can play the URL
      return _FilePlayer.FilePlayer;
    }
  }, {
    key: 'renderActivePlayer',
    value: function renderActivePlayer(url, activePlayer) {
      if (!url) return null;
      return _react2['default'].createElement(_Player5['default'], _extends({}, this.props, {
        key: activePlayer.displayName,
        ref: this.activePlayerRef,
        config: this.config,
        activePlayer: activePlayer,
        onReady: this.onReady
      }));
    }
  }, {
    key: 'sortPlayers',
    value: function sortPlayers(a, b) {
      // Retain player order to prevent weird iframe behaviour when switching players
      if (a && b) {
        return a.key < b.key ? -1 : 1;
      }
      return 0;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          url = _props.url,
          style = _props.style,
          width = _props.width,
          height = _props.height,
          light = _props.light,
          Wrapper = _props.wrapper;
      var showPreview = this.state.showPreview;

      var otherProps = (0, _utils.omit)(this.props, SUPPORTED_PROPS, _props2.DEPRECATED_CONFIG_PROPS);
      var activePlayer = this.getActivePlayer(url);
      var renderedActivePlayer = this.renderActivePlayer(url, activePlayer);
      var preloadPlayers = (0, _preload2['default'])(url, this.config);
      var players = [renderedActivePlayer].concat(_toConsumableArray(preloadPlayers)).sort(this.sortPlayers);
      if (showPreview && url) {
        return _react2['default'].createElement(_Preview2['default'], {
          url: url,
          light: light,
          onClick: this.onClickPreview
        });
      }
      return _react2['default'].createElement(
        Wrapper,
        _extends({ ref: this.wrapperRef, style: _extends({}, style, { width: width, height: height }) }, otherProps),
        players
      );
    }
  }]);

  return ReactPlayer;
}(_react.Component);

ReactPlayer.addCustomPlayer = function (player) {
  customPlayers.push(player);
};

ReactPlayer.removeCustomPlayers = function () {
  customPlayers = [];
};

ReactPlayer.displayName = 'ReactPlayer';
ReactPlayer.propTypes = _props2.propTypes;
ReactPlayer.defaultProps = _props2.defaultProps;

ReactPlayer.canPlay = function (url) {
  var _arr2 = [].concat(_toConsumableArray(customPlayers), _toConsumableArray(_players2['default']));

  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
    var _Player2 = _arr2[_i2];
    if (_Player2.canPlay(url)) {
      return true;
    }
  }
  return false;
};

ReactPlayer.canEnablePIP = function (url) {
  var _arr3 = [].concat(_toConsumableArray(customPlayers), _toConsumableArray(_players2['default']));

  for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
    var _Player3 = _arr3[_i3];
    if (_Player3.canEnablePIP && _Player3.canEnablePIP(url)) {
      return true;
    }
  }
  return false;
};

exports['default'] = ReactPlayer;