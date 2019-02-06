'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ICON_SIZE = '64px';

var Preview = function (_Component) {
  _inherits(Preview, _Component);

  function Preview() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Preview);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Preview.__proto__ || Object.getPrototypeOf(Preview)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      image: null
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Preview, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.fetchImage(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.url !== nextProps.url) {
        this.fetchImage(nextProps);
      }
    }
  }, {
    key: 'fetchImage',
    value: function fetchImage(_ref2) {
      var _this2 = this;

      var url = _ref2.url,
          light = _ref2.light;

      if (typeof light === 'string') {
        this.setState({ image: light });
        return;
      }
      this.setState({ image: null });
      return window.fetch('https://noembed.com/embed?url=' + url).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.thumbnail_url) {
          var image = data.thumbnail_url.replace('height=100', 'height=480');
          _this2.setState({ image: image });
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var onClick = this.props.onClick;
      var image = this.state.image;

      var flexCenter = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
      var styles = {
        preview: _extends({
          width: '100%',
          height: '100%',
          backgroundImage: image ? 'url(' + image + ')' : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer'
        }, flexCenter),
        shadow: _extends({
          background: 'radial-gradient(rgb(0, 0, 0, 0.3), rgba(0, 0, 0, 0) 60%)',
          borderRadius: ICON_SIZE,
          width: ICON_SIZE,
          height: ICON_SIZE
        }, flexCenter),
        playIcon: {
          borderStyle: 'solid',
          borderWidth: '16px 0 16px 26px',
          borderColor: 'transparent transparent transparent white',
          marginLeft: '7px'
        }
      };
      return _react2['default'].createElement(
        'div',
        { style: styles.preview, className: 'react-player__preview', onClick: onClick },
        _react2['default'].createElement(
          'div',
          { style: styles.shadow, className: 'react-player__shadow' },
          _react2['default'].createElement('div', { style: styles.playIcon, className: 'react-player__play-icon' })
        )
      );
    }
  }]);

  return Preview;
}(_react.Component);

exports['default'] = Preview;