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
var Player_exports = {};
__export(Player_exports, {
  default: () => Player
});
module.exports = __toCommonJS(Player_exports);
var import_react = __toESM(require("react"));
var import_react_fast_compare = __toESM(require("react-fast-compare"));
var import_props = require("./props");
var import_utils = require("./utils");
const SEEK_ON_PLAY_EXPIRY = 5e3;
class Player extends import_react.Component {
  constructor() {
    super(...arguments);
    __publicField(this, "mounted", false);
    __publicField(this, "isReady", false);
    __publicField(this, "isPlaying", false);
    // Track playing state internally to prevent bugs
    __publicField(this, "isLoading", true);
    // Use isLoading to prevent onPause when switching URL
    __publicField(this, "loadOnReady", null);
    __publicField(this, "startOnPlay", true);
    __publicField(this, "seekOnPlay", null);
    __publicField(this, "onDurationCalled", false);
    __publicField(this, "handlePlayerMount", (player) => {
      if (this.player) {
        this.progress();
        return;
      }
      this.player = player;
      this.player.load(this.props.url);
      this.progress();
    });
    __publicField(this, "getInternalPlayer", (key) => {
      if (!this.player)
        return null;
      return this.player[key];
    });
    __publicField(this, "progress", () => {
      if (this.props.url && this.player && this.isReady) {
        const playedSeconds = this.getCurrentTime() || 0;
        const loadedSeconds = this.getSecondsLoaded();
        const duration = this.getDuration();
        if (duration) {
          const progress = {
            playedSeconds,
            played: playedSeconds / duration
          };
          if (loadedSeconds !== null) {
            progress.loadedSeconds = loadedSeconds;
            progress.loaded = loadedSeconds / duration;
          }
          if (progress.playedSeconds !== this.prevPlayed || progress.loadedSeconds !== this.prevLoaded) {
            this.props.onProgress(progress);
          }
          this.prevPlayed = progress.playedSeconds;
          this.prevLoaded = progress.loadedSeconds;
        }
      }
      this.progressTimeout = setTimeout(this.progress, this.props.progressFrequency || this.props.progressInterval);
    });
    __publicField(this, "handleReady", () => {
      if (!this.mounted)
        return;
      this.isReady = true;
      this.isLoading = false;
      const { onReady, playing, volume, muted } = this.props;
      onReady();
      if (!muted && volume !== null) {
        this.player.setVolume(volume);
      }
      if (this.loadOnReady) {
        this.player.load(this.loadOnReady, true);
        this.loadOnReady = null;
      } else if (playing) {
        this.player.play();
      }
      this.handleDurationCheck();
    });
    __publicField(this, "handlePlay", () => {
      this.isPlaying = true;
      this.isLoading = false;
      const { onStart, onPlay, playbackRate } = this.props;
      if (this.startOnPlay) {
        if (this.player.setPlaybackRate && playbackRate !== 1) {
          this.player.setPlaybackRate(playbackRate);
        }
        onStart();
        this.startOnPlay = false;
      }
      onPlay();
      if (this.seekOnPlay) {
        this.seekTo(this.seekOnPlay);
        this.seekOnPlay = null;
      }
      this.handleDurationCheck();
    });
    __publicField(this, "handlePause", (e) => {
      this.isPlaying = false;
      if (!this.isLoading) {
        this.props.onPause(e);
      }
    });
    __publicField(this, "handleEnded", () => {
      const { activePlayer, loop, onEnded } = this.props;
      if (activePlayer.loopOnEnded && loop) {
        this.seekTo(0);
      }
      if (!loop) {
        this.isPlaying = false;
        onEnded();
      }
    });
    __publicField(this, "handleError", (...args) => {
      this.isLoading = false;
      this.props.onError(...args);
    });
    __publicField(this, "handleDurationCheck", () => {
      clearTimeout(this.durationCheckTimeout);
      const duration = this.getDuration();
      if (duration) {
        if (!this.onDurationCalled) {
          this.props.onDuration(duration);
          this.onDurationCalled = true;
        }
      } else {
        this.durationCheckTimeout = setTimeout(this.handleDurationCheck, 100);
      }
    });
    __publicField(this, "handleLoaded", () => {
      this.isLoading = false;
    });
  }
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
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
  componentDidUpdate(prevProps) {
    if (!this.player) {
      return;
    }
    const { url, playing, volume, muted, playbackRate, pip, loop, activePlayer, disableDeferredLoading } = this.props;
    if (!(0, import_react_fast_compare.default)(prevProps.url, url)) {
      if (this.isLoading && !activePlayer.forceLoad && !disableDeferredLoading && !(0, import_utils.isMediaStream)(url)) {
        console.warn(`ReactPlayer: the attempt to load ${url} is being deferred until the player has loaded`);
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
          setTimeout(() => this.player.setVolume(volume));
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
  getDuration() {
    if (!this.isReady)
      return null;
    return this.player.getDuration();
  }
  getCurrentTime() {
    if (!this.isReady)
      return null;
    return this.player.getCurrentTime();
  }
  getSecondsLoaded() {
    if (!this.isReady)
      return null;
    return this.player.getSecondsLoaded();
  }
  seekTo(amount, type, keepPlaying) {
    if (!this.isReady) {
      if (amount !== 0) {
        this.seekOnPlay = amount;
        setTimeout(() => {
          this.seekOnPlay = null;
        }, SEEK_ON_PLAY_EXPIRY);
      }
      return;
    }
    const isFraction = !type ? amount > 0 && amount < 1 : type === "fraction";
    if (isFraction) {
      const duration = this.player.getDuration();
      if (!duration) {
        console.warn("ReactPlayer: could not seek using fraction \u2013\xA0duration not yet available");
        return;
      }
      this.player.seekTo(duration * amount, keepPlaying);
      return;
    }
    this.player.seekTo(amount, keepPlaying);
  }
  render() {
    const Player2 = this.props.activePlayer;
    if (!Player2) {
      return null;
    }
    return /* @__PURE__ */ import_react.default.createElement(
      Player2,
      {
        ...this.props,
        onMount: this.handlePlayerMount,
        onReady: this.handleReady,
        onPlay: this.handlePlay,
        onPause: this.handlePause,
        onEnded: this.handleEnded,
        onLoaded: this.handleLoaded,
        onError: this.handleError
      }
    );
  }
}
__publicField(Player, "displayName", "Player");
__publicField(Player, "propTypes", import_props.propTypes);
__publicField(Player, "defaultProps", import_props.defaultProps);
