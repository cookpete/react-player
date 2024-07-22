var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var players_exports = {};
__export(players_exports, {
  default: () => players_default
});
module.exports = __toCommonJS(players_exports);
var import_utils = require("../utils");
var import_patterns = require("../patterns");
var players_default = [
  {
    key: "youtube",
    name: "YouTube",
    canPlay: import_patterns.canPlay.youtube,
    lazyPlayer: (0, import_utils.lazy)(() => import(
      /* webpackChunkName: 'reactPlayerYouTube' */
      "./YouTube"
    ))
  },
  {
    key: "soundcloud",
    name: "SoundCloud",
    canPlay: import_patterns.canPlay.soundcloud,
    lazyPlayer: (0, import_utils.lazy)(() => import(
      /* webpackChunkName: 'reactPlayerSoundCloud' */
      "./SoundCloud"
    ))
  },
  {
    key: "vimeo",
    name: "Vimeo",
    canPlay: import_patterns.canPlay.vimeo,
    lazyPlayer: (0, import_utils.lazy)(() => import(
      /* webpackChunkName: 'reactPlayerVimeo' */
      "./Vimeo"
    ))
  },
  {
    key: "mux",
    name: "Mux",
    canPlay: import_patterns.canPlay.mux,
    lazyPlayer: (0, import_utils.lazy)(() => import(
      /* webpackChunkName: 'reactPlayerMux' */
      "./Mux"
    ))
  },
  {
    key: "facebook",
    name: "Facebook",
    canPlay: import_patterns.canPlay.facebook,
    lazyPlayer: (0, import_utils.lazy)(() => import(
      /* webpackChunkName: 'reactPlayerFacebook' */
      "./Facebook"
    ))
  },
  {
    key: "streamable",
    name: "Streamable",
    canPlay: import_patterns.canPlay.streamable,
    lazyPlayer: (0, import_utils.lazy)(() => import(
      /* webpackChunkName: 'reactPlayerStreamable' */
      "./Streamable"
    ))
  },
  {
    key: "wistia",
    name: "Wistia",
    canPlay: import_patterns.canPlay.wistia,
    lazyPlayer: (0, import_utils.lazy)(() => import(
      /* webpackChunkName: 'reactPlayerWistia' */
      "./Wistia"
    ))
  },
  {
    key: "twitch",
    name: "Twitch",
    canPlay: import_patterns.canPlay.twitch,
    lazyPlayer: (0, import_utils.lazy)(() => import(
      /* webpackChunkName: 'reactPlayerTwitch' */
      "./Twitch"
    ))
  },
  {
    key: "dailymotion",
    name: "DailyMotion",
    canPlay: import_patterns.canPlay.dailymotion,
    lazyPlayer: (0, import_utils.lazy)(() => import(
      /* webpackChunkName: 'reactPlayerDailyMotion' */
      "./DailyMotion"
    ))
  },
  {
    key: "mixcloud",
    name: "Mixcloud",
    canPlay: import_patterns.canPlay.mixcloud,
    lazyPlayer: (0, import_utils.lazy)(() => import(
      /* webpackChunkName: 'reactPlayerMixcloud' */
      "./Mixcloud"
    ))
  },
  {
    key: "vidyard",
    name: "Vidyard",
    canPlay: import_patterns.canPlay.vidyard,
    lazyPlayer: (0, import_utils.lazy)(() => import(
      /* webpackChunkName: 'reactPlayerVidyard' */
      "./Vidyard"
    ))
  },
  {
    key: "kaltura",
    name: "Kaltura",
    canPlay: import_patterns.canPlay.kaltura,
    lazyPlayer: (0, import_utils.lazy)(() => import(
      /* webpackChunkName: 'reactPlayerKaltura' */
      "./Kaltura"
    ))
  },
  {
    key: "spotify",
    name: "Spotify",
    canPlay: import_patterns.canPlay.spotify,
    lazyPlayer: (0, import_utils.lazy)(() => import(
      /* webpackChunkName: 'reactPlayerSpotify' */
      "./Spotify"
    ))
  },
  {
    key: "file",
    name: "FilePlayer",
    canPlay: import_patterns.canPlay.file,
    canEnablePIP: (url) => {
      return import_patterns.canPlay.file(url) && (document.pictureInPictureEnabled || (0, import_utils.supportsWebKitPresentationMode)()) && !import_patterns.AUDIO_EXTENSIONS.test(url);
    },
    lazyPlayer: (0, import_utils.lazy)(() => import(
      /* webpackChunkName: 'reactPlayerFilePlayer' */
      "./FilePlayer"
    ))
  }
];
