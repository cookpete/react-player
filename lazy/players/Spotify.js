var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var Spotify_exports = {};
__export(Spotify_exports, {
  default: () => Spotify
});
module.exports = __toCommonJS(Spotify_exports);
var import_react = __toESM(require("react"));
var import_utils = require("../utils");
var import_patterns = require("../patterns");
const SDK_URL = "https://open.spotify.com/embed/iframe-api/v1";
const SDK_GLOBAL = "SpotifyIframeApi";
const SDK_GLOBAL_READY = "SpotifyIframeApi";
class Spotify extends import_react.Component {
  constructor() {
    super(...arguments);
    __publicField(this, "callPlayer", import_utils.callPlayer);
    __publicField(this, "duration", null);
    __publicField(this, "currentTime", null);
    __publicField(this, "totalTime", null);
    __publicField(this, "player", null);
    __publicField(this, "initializePlayer", (IFrameAPI, url) => {
      if (!this.container)
        return;
      const options = {
        width: "100%",
        height: "100%",
        uri: url
      };
      const callback = (EmbedController) => {
        this.player = EmbedController;
        this.player.addListener("playback_update", this.onStateChange);
        this.player.addListener("ready", this.props.onReady);
      };
      IFrameAPI.createController(this.container, options, callback);
    });
    __publicField(this, "onStateChange", (event) => {
      const { data } = event;
      const { onPlay, onPause, onBuffer, onBufferEnd, onEnded } = this.props;
      if (data.position >= data.duration && data.position && data.duration) {
        onEnded();
      }
      if (data.isPaused === true)
        onPause();
      if (data.isPaused === false && data.isBuffering === false) {
        this.currentTime = data.position;
        this.totalTime = data.duration;
        onPlay();
        onBufferEnd();
      }
      if (data.isBuffering === true)
        onBuffer();
    });
    __publicField(this, "ref", (container) => {
      this.container = container;
    });
  }
  componentDidMount() {
    this.props.onMount && this.props.onMount(this);
  }
  load(url) {
    const isValidSdk = window[SDK_GLOBAL] && !this.player && window[SDK_GLOBAL].createController && typeof window[SDK_GLOBAL].createController === "function";
    if (isValidSdk) {
      this.initializePlayer(window[SDK_GLOBAL], url);
      return;
    } else if (this.player) {
      this.callPlayer("loadUri", this.props.url);
      return;
    }
    window.onSpotifyIframeApiReady = (IFrameAPI) => this.initializePlayer(IFrameAPI, url);
    (0, import_utils.getSDK)(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY);
  }
  play() {
    this.callPlayer("resume");
  }
  pause() {
    this.callPlayer("pause");
  }
  stop() {
    this.callPlayer("destroy");
  }
  seekTo(amount) {
    this.callPlayer("seek", amount);
    if (!this.props.playing) {
      this.pause();
    } else {
      this.play();
    }
  }
  setVolume(fraction) {
  }
  mute() {
  }
  unmute() {
  }
  setPlaybackRate(rate) {
  }
  setLoop(loop) {
  }
  getDuration() {
    return this.totalTime / 1e3;
  }
  getCurrentTime() {
    return this.currentTime / 1e3;
  }
  getSecondsLoaded() {
  }
  render() {
    const style = {
      width: "100%",
      height: "100%"
    };
    return /* @__PURE__ */ import_react.default.createElement("div", { style }, /* @__PURE__ */ import_react.default.createElement("div", { ref: this.ref }));
  }
}
__publicField(Spotify, "displayName", "Spotify");
__publicField(Spotify, "loopOnEnded", true);
__publicField(Spotify, "canPlay", import_patterns.canPlay.spotify);
