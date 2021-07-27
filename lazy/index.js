"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _players = _interopRequireDefault(require("./players"));

var _ReactPlayer = require("./ReactPlayer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Fall back to FilePlayer if nothing else can play the URL
var fallback = _players["default"][_players["default"].length - 1];

var _default = (0, _ReactPlayer.createReactPlayer)(_players["default"], fallback);

exports["default"] = _default;