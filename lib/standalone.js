'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = renderReactPlayer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _ReactPlayer = require('./ReactPlayer');

var _ReactPlayer2 = _interopRequireDefault(_ReactPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function renderReactPlayer(container, props) {
  (0, _reactDom.render)(_react2['default'].createElement(_ReactPlayer2['default'], props), container);
}