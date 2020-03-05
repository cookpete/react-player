"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = renderReactPlayer;

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

var _ReactPlayer = _interopRequireDefault(require("./ReactPlayer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function renderReactPlayer(container, props) {
  (0, _reactDom.render)(_react["default"].createElement(_ReactPlayer["default"], props), container);
}