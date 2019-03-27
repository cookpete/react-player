'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vimeo = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

var _singlePlayer = require('../singlePlayer');

var _singlePlayer2 = _interopRequireDefault(_singlePlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SDK_URL = 'https://player.vimeo.com/api/player.js';
var SDK_GLOBAL = 'Vimeo';
var MATCH_URL = /vimeo\.com\/.+/;
var MATCH_FILE_URL = /vimeo\.com\/external\/.+\.mp4/;

var Vimeo = exports.Vimeo = function (_Component) {
  _inherits(Vimeo, _Component);

  function Vimeo() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Vimeo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Vimeo.__proto__ || Object.getPrototypeOf(Vimeo)).call.apply(_ref, [this].concat(args))), _this), _this.callPlayer = _utils.callPlayer, _this.duration = null, _this.currentTime = null, _this.secondsLoaded = null, _this.mute = function () {
      _this.setVolume(0);
    }, _this.unmute = function () {
      if (_this.props.volume !== null) {
        _this.setVolume(_this.props.volume);
      }
    }, _this.ref = function (container) {
      _this.container = container;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Vimeo, [{
    key: 'load',
    value: function load(url) {
      var _this2 = this;

      this.duration = null;
      (0, _utils.getSDK)(SDK_URL, SDK_GLOBAL).then(function (Vimeo) {
        if (!_this2.container) return;
        _this2.player = new Vimeo.Player(_this2.container, _extends({
          url: url,
          autoplay: _this2.props.playing,
          muted: _this2.props.muted,
          loop: _this2.props.loop,
          playsinline: _this2.props.playsinline
        }, _this2.props.config.vimeo.playerOptions));
        _this2.player.ready().then(function () {
          var iframe = _this2.container.querySelector('iframe');
          iframe.style.width = '100%';
          iframe.style.height = '100%';
        })['catch'](_this2.props.onError);
        _this2.player.on('loaded', function () {
          _this2.props.onReady();
          _this2.refreshDuration();
        });
        _this2.player.on('play', function () {
          _this2.props.onPlay();
          _this2.refreshDuration();
        });
        _this2.player.on('pause', _this2.props.onPause);
        _this2.player.on('seeked', function (e) {
          return _this2.props.onSeek(e.seconds);
        });
        _this2.player.on('ended', _this2.props.onEnded);
        _this2.player.on('error', _this2.props.onError);
        _this2.player.on('timeupdate', function (_ref2) {
          var seconds = _ref2.seconds;

          _this2.currentTime = seconds;
        });
        _this2.player.on('progress', function (_ref3) {
          var seconds = _ref3.seconds;

          _this2.secondsLoaded = seconds;
        });
      }, this.props.onError);
    }
  }, {
    key: 'refreshDuration',
    value: function refreshDuration() {
      var _this3 = this;

      this.player.getDuration().then(function (duration) {
        _this3.duration = duration;
      });
    }
  }, {
    key: 'play',
    value: function play() {
      this.callPlayer('play');
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.callPlayer('pause');
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.callPlayer('unload');
    }
  }, {
    key: 'seekTo',
    value: function seekTo(seconds) {
      this.callPlayer('setCurrentTime', seconds);
    }
  }, {
    key: 'setVolume',
    value: function setVolume(fraction) {
      this.callPlayer('setVolume', fraction);
    }
  }, {
    key: 'setLoop',
    value: function setLoop(loop) {
      this.callPlayer('setLoop', loop);
    }
  }, {
    key: 'getDuration',
    value: function getDuration() {
      return this.duration;
    }
  }, {
    key: 'getCurrentTime',
    value: function getCurrentTime() {
      return this.currentTime;
    }
  }, {
    key: 'getSecondsLoaded',
    value: function getSecondsLoaded() {
      return this.secondsLoaded;
    }
  }, {
    key: 'render',
    value: function render() {
      var style = _extends({
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'black'
      }, this.props.style);
      return _react2['default'].createElement('div', {
        key: this.props.url,
        ref: this.ref,
        style: style
      });
    }
  }]);

  return Vimeo;
}(_react.Component);

Vimeo.displayName = 'Vimeo';

Vimeo.canPlay = function (url) {
  if (MATCH_FILE_URL.test(url)) {
    return false;
  }
  return MATCH_URL.test(url);
};

exports['default'] = (0, _singlePlayer2['default'])(Vimeo);