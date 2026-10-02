## Migrating to `v4.0`

Breaking changes are in 🔥 __bold and on fire__.

`v4.0` plays every source with the [Video.js v10](https://videojs.org) React media components (`@videojs/react/media/*`) instead of the standalone `*-video-element` packages and `@mux/mux-player-react`. Props, callbacks, static methods and per-player lazy loading work as before, apart from the changes below.

### React 18 or later

`@videojs/react` requires React 18, so 🔥 __React 17 is no longer supported__. The peer range is now `^18 || ^19`.

### `ref` and `mediaRef`

ReactPlayer now follows the Video.js v10 media contract:

- 🔥 __`ref` points to the rendered DOM element__: the `<video>` or `<audio>` element, or the embed's `<iframe>` (`<wistia-player>` for Wistia).
- __`mediaRef` is new__ and points to the object that plays the media. It is compatible with the [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) interface for every player: the `<video>`/`<audio>` element for files and streams, and a Video.js playback adapter for embeds.

In `v3`, `ref` was a media element for every player, including the custom elements behind embeds. 🔥 __Use `mediaRef` for the media API__ (`play()`, `pause()`, `currentTime`, `duration`, ...):

```jsx
// Before
const playerRef = useRef(null);
<ReactPlayer ref={playerRef} src={src} />
playerRef.current.currentTime = 30;

// After
const mediaRef = useRef(null);
<ReactPlayer mediaRef={mediaRef} src={src} />
mediaRef.current.currentTime = 30;
```

For files and streams `ref` and `mediaRef` are the same element, so existing `ref` code keeps working there. Switching to `mediaRef` makes it work for every player.

If you used `ref.current.api` to reach an embed's own SDK, 🔥 __it is now `mediaRef.current.engine`__ for YouTube, Vimeo, Spotify, Twitch and TikTok (for example the YouTube IFrame API player). It can be `null` until the SDK has loaded. Wistia's `mediaRef` is the `<wistia-player>` element itself. The hls.js and dash.js instances are not exposed.

The `ref` type is now `HTMLElement`, since it is not always a media element.

### The `config` prop

`config` still configures every player in one object, but 🔥 __its keys are now named after the Video.js v10 engine__ that reads them, and each holds that engine's own options. ReactPlayer passes it to every player as v10's [`source.engine`](https://videojs.org/docs/framework/react/guides/media-sources), and each player reads only its own key.

- 🔥 __`config.hls` => `config.hlsJs`__ (hls.js config, unchanged). Mux also reads it.
- 🔥 __`config.dash` => `config.dashJs`__ ([dash.js settings](https://cdn.dashjs.org/latest/jsdoc/module-Settings.html))
- __`config.nativeHls`__ is new: options for the browser's own HLS playback, used by HLS and Mux sources when the browser plays them natively.
- 🔥 __`config.mux`__ takes `MuxSource` options from [`@videojs/mux-video`](https://www.npmjs.com/package/@videojs/mux-video): `playback`, `poster`, `storyboard` and `drm`.
- 🔥 __`config.html`__ is removed. It was never applied.
- `config.youtube`, `config.vimeo` and `config.wistia` still take each provider's own player parameters.
- 🔥 __Some options changed shape__ to match the embeds' own parameters:
  - `config.spotify`: `startAt` => `t` (seconds), and `theme: 'dark'` => `theme: 0` (leave it out for the light theme).
  - `config.tiktok`: options are `0 | 1` instead of booleans, e.g. `progress_bar: true` => `progress_bar: 1`.
  - `config.twitch`: `time` is a Twitch timestamp string such as `'1h30m10s'` instead of a number.

```jsx
// Before
<ReactPlayer
  src={src}
  config={{
    hls: { maxBufferLength: 60 },
    dash: { streaming: { abr: { autoSwitchBitrate: { video: false } } } },
    youtube: { color: 'white' },
  }}
/>

// After
<ReactPlayer
  src={src}
  config={{
    hlsJs: { maxBufferLength: 60 },
    dashJs: { streaming: { abr: { autoSwitchBitrate: { video: false } } } },
    youtube: { color: 'white' },
  }}
/>
```

The `Config` TypeScript type is built from the v10 engine config types, so the compiler flags old keys and values.

### Mux

Mux URLs used to render [Mux Player](https://www.mux.com/player). They now render Video.js v10's `MuxVideo`, a plain video element:

- 🔥 __No built-in player UI__. Set `controls` for the browser's native controls, or build your own, e.g. with [Media Chrome](https://github.com/muxinc/media-chrome). The `--controls` CSS variable no longer does anything.
- 🔥 __Mux Data is no longer sent automatically.__ Mux Player had it built in; `MuxVideo` sends nothing.
- 🔥 __No automatic poster.__ Mux Player showed the Mux thumbnail before playback; `MuxVideo` doesn't. Use the `light` prop with the thumbnail URL instead, e.g. `light="https://image.mux.com/<playback-id>/thumbnail.webp"`.
- Playback options and storyboard thumbnails still come from the playback ID and `config.mux`, e.g. `config={{ mux: { playback: { maxResolution: '1080p' } } }}`.

URLs with the `.m3u8` extension (`https://stream.mux.com/<id>.m3u8`) still play with hls.js rather than Mux.

### Media Chrome

Media Chrome controls the element in `slot="media"`. 🔥 __For embeds, that element is now an `<iframe>`__, which Media Chrome can't control. File, HLS, DASH and Mux sources still render a `<video>` and keep working.

### URL matching

ReactPlayer picks a player with v10's `resolveAdapterType`, so it recognizes the same sources as the media it renders.

🔥 __These URLs no longer match a service player__ and fall back to the HTML player:

URL | `v3` | `v4`
--- | --- | ---
`youtube.com/user/...`, `music.youtube.com/watch?v=...` | YouTube | HTML
`vimeo.com/channels/<channel>/<id>`, `vimeo.com/showcase/<id>` | Vimeo | HTML
`player.twitch.tv/?video=<id>` | Twitch | HTML

Newly recognized: localized Spotify URLs (`open.spotify.com/intl-de/track/...`), `spotify:` URIs, `youtube/<id>` and `vimeo/<id>` shorthands, and `.flac` files.

### `react-player/patterns`

- 🔥 __The URL regexes are no longer exported__: `HLS_EXTENSIONS`, `DASH_EXTENSIONS`, `MATCH_URL_MUX`, `MATCH_URL_YOUTUBE`, `MATCH_URL_VIMEO`, `MATCH_URL_WISTIA`, `MATCH_URL_SPOTIFY`, `MATCH_URL_TWITCH` and `MATCH_URL_TIKTOK`. Use `resolveAdapterType` from `@videojs/react` to classify a URL. `AUDIO_EXTENSIONS` and `VIDEO_EXTENSIONS` are still exported.
- 🔥 __`canPlay` is a function of the player key__: `canPlay.youtube(url)` => `canPlay('youtube')(url)`.

```js
// Before
import { MATCH_URL_YOUTUBE } from 'react-player/patterns';
MATCH_URL_YOUTUBE.test(url);

// After
import { resolveAdapterType } from '@videojs/react';
resolveAdapterType(url) === 'youtube';
```

`ReactPlayer.canPlay(src)` is unchanged.

### Custom players

Players added with `addCustomPlayer` follow the same contract as the Video.js v10 media components:

- 🔥 __Forward `ref` to the element you render and hand the media to the `mediaRef` prop.__ ReactPlayer controls playback (`playing`, `volume`, `playbackRate`, `pip`) through `mediaRef`.
- 🔥 __Custom players receive the whole `config` object__ rather than only their own key.
- 🔥 __`PlayerEntry` no longer has a `name` field.__

### Dependencies

The `*-video-element` packages (`youtube-video-element`, `hls-video-element`, ...) and `@mux/mux-player-react` are 🔥 __no longer installed with ReactPlayer__. If your app imports them directly, add them to your own dependencies.


## Migrating to `v3.0`

Breaking changes are in 🔥 __bold and on fire__.

### Some player providers are not supported yet

Since `v3.0` is a new architecture not all providers have been updated.
It is recommended to keep using `v2` and vote to add this provider to `v3` in [discussions](https://github.com/cookpete/react-player/discussions).
These include:

  - `Dailymotion`
  - `SoundCloud`
  - `Streamable`
  - `Twitch`
  - `Facebook`
  - `Mixcloud`
  - `Kaltura`

### Lazy players

As of `v3.0` all the players are lazy loaded by default. 
Due to the use of `lazy` and `Suspense`, 🔥 __React 16.6 or later is now required__.

### Player props

As of `v3.0` some player props are renamed to be closer to the native
[HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) naming.

- 🔥 __`url` => `src`__
- 🔥 __`playsinline` => `playsInline`__
- 🔥 __`progressInterval`__ deprecated
- 🔥 __`stopOnUnmount`__ deprecated
- 🔥 __`wrapper`__ is `undefined` by default. Set to `div` if you want a wrapper element.

### Player instance methods

As of `v3.0` use [`ref`](https://react.dev/learn/manipulating-the-dom-with-refs) to call instance methods on the player. See [the demo app](examples/react/src/App.tsx) for an example of this. Since `v3`, the instance methods aim to be 🔥 __compatible 
with the [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) interface__.

### Player callback props

As of `v3.0` some player callback props are renamed to be closer to the native
[HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) event naming.

- 🔥 __`onProgress` => `onTimeUpdate` and `onProgress`__
- 🔥 __`onDuration` => `onDurationChange`__
- 🔥 __`onPlaybackRateChange` => `onRateChange`__
- 🔥 __`onSeek` => `onSeeking` and `onSeeked`__
- 🔥 __`onBuffer` => `onWaiting`__
- 🔥 __`onBufferEnd` => `onPlaying`__
- 🔥 __`onEnablePIP` => `onEnterPictureInPicture`__
- 🔥 __`onDisablePIP` => `onLeavePictureInPicture`__


## Migrating to `v2.0`

Breaking changes are in 🔥 __bold and on fire__.

### Lazy players

As of `v2.2`, if your build system supports `import()` statements, use `react-player/lazy` to [lazy load](https://reactjs.org/docs/code-splitting.html#reactlazy) the appropriate player for the `url` you pass in. This adds several `reactPlayer` chunks to your output, but reduces your main bundle size.

Due to the use of `lazy` and `Suspense`, 🔥 __React 16.6 or later is now required__.

```jsx
// Before
import ReactPlayer from 'react-player'

// After
import ReactPlayer from 'react-player/lazy'
```

Lazy players were the default import in `v2.1`, but moved to `react-player/lazy` in `v2.2` to avoid causing problems with common build systems.

### Single player imports

As of `v2.2`, the 🔥 __location of single player imports has changed__. Single players are not available in `v2.0` and `v2.1`.

```jsx
// Before
import ReactPlayer from 'react-player/lib/players/YouTube'

// After
import ReactPlayer from 'react-player/youtube'
```

### Preloading

The `preload` config option was originally added to solve a [very specific use case](https://github.com/CookPete/react-player/issues/7) a very long time ago. Modern browsers are trending towards disabling autoplay by default, which makes the preload behaviour quite useless. The implementation was also quite hacky, and added to the bundle size for a feature that seems to be very rarely used. For this reason, 🔥 __the `preload` option has been removed__.

### The `config` prop

🔥 __Deprecated config props have been removed.__ Previously these props still worked, but with a console warning.

```jsx
// Before
<ReactPlayer 
  youtubeConfig={{ playerVars: { showinfo: 1 } }} 
/>

// After
<ReactPlayer 
  config={{ youtube: { playerVars: { showinfo: 1 } }}} 
/>
```

It is also worth noting that you no longer need to use separate config keys for different players. For example, if you are only ever using one type of `url` you can put player-specific options directly inside `config`.

```jsx
// Before
<ReactPlayer 
  youtubeConfig={{ playerVars: { showinfo: 1 } }} 
/>

// After
<ReactPlayer 
  config={{ playerVars: { showinfo: 1 } }} 
/>
```

### `onReady` is invoked with the player instance

Previously, instance methods would be called using [refs](https://reactjs.org/docs/refs-and-the-dom.html). They still can, but in v2.0, `onReady` is called with the ReactPlayer instance, giving you the option of storing the instance and calling methods on it. This is especially useful when using `getInternalPlayer`.

```jsx
// Before
class Player extends Component {
  ref = player => {
    this.player = player            // Store a player that may not be ready for methods
    this.player.getInternalPlayer() // Returns null if player is not ready
  }
  handleReady = () => {
    this.player.getInternalPlayer() // Internal player now ready
  }
  render () {
    return (
      <ReactPlayer ref={this.ref} onReady={this.handleReady} />
    )
  }
}

// After
class Player extends Component {
  handleReady = player => {
    this.player = player            // Store a player that is ready for methods
    this.player.getInternalPlayer() // Internal player now ready
  }
  render () {
    return (
      <ReactPlayer onReady={this.handleReady} />
    )
  }
}
