<h1 align='center'>
  ReactPlayer
</h1>

<p align='center'>
  <a href='https://www.npmjs.com/package/react-player'>
    <img src='https://img.shields.io/npm/v/react-player.svg' alt='Latest npm version'>
  </a>
  <a href='https://travis-ci.org/CookPete/react-player'>
    <img src='https://img.shields.io/travis/CookPete/react-player/master.svg' alt='Build Status'>
  </a>
  <a href='https://david-dm.org/CookPete/react-player'>
    <img src='https://img.shields.io/david/CookPete/react-player.svg' alt='Dependency Status'>
  </a>
  <a href='https://codecov.io/gh/CookPete/react-player'>
    <img src='https://img.shields.io/codecov/c/github/cookpete/react-player.svg' alt='Test Coverage'>
  </a>
  <a href='https://paypal.me/ckpt'>
    <img src='https://img.shields.io/badge/donate-PayPal-blue.svg' alt='Donate'>
  </a>
</p>

<p align='center'>
  A React component for playing a variety of URLs, including file paths, YouTube, Facebook, Twitch, SoundCloud, Streamable, Vimeo, Wistia, Mixcloud, and DailyMotion. Not using React? <a href='#standalone-player'>No problem.</a>
</p>

### Usage

```bash
npm install react-player --save
# or
yarn add react-player
```

```js
import React, { Component } from 'react'
import ReactPlayer from 'react-player'

class App extends Component {
  render () {
    return <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' playing />
  }
}
```

Demo page: [`https://cookpete.com/react-player`](https://cookpete.com/react-player)

The component parses a URL and loads in the appropriate markup and external SDKs to play media from [various sources](#supported-media). [Props](#props) can be passed in to control playback and react to events such as buffering or media ending. See [the demo source](https://github.com/CookPete/react-player/blob/master/src/demo/App.js) for a full example.

For platforms without direct use of `npm` modules, a minified version of `ReactPlayer` is located in `dist` after installing. To generate this file yourself, checkout the repo and run `npm run build:dist`.

#### Polyfills

* If you are using `npm` and need to support [browsers without `Promise`](http://caniuse.com/#feat=promises) you will need a [`Promise` polyfill](https://github.com/stefanpenner/es6-promise).
* To support IE11 you will need to use [`babel-polyfill`](https://babeljs.io/docs/usage/polyfill) or a similar ES2015+ polyfill.

#### Autoplay

As of Chrome 66, [videos must be `muted` in order to play automatically](https://www.theverge.com/2018/3/22/17150870/google-chrome-autoplay-videos-sound-mute-update). Some players, like Facebook, cannot be unmuted until the user interacts with the video, so you may want to enable `controls` to allow users to unmute videos themselves.

### Props

Prop | Description | Default
---- | ----------- | -------
`url` | The url of a video or song to play<br/>&nbsp; ◦ &nbsp;Can be an [array](#multiple-sources-and-tracks) or [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) object
`playing` | Set to `true` or `false` to pause or play the media | `false`
`loop` | Set to `true` or `false` to loop the media | `false`
`controls` | Set to `true` or `false` to display native player controls<br />&nbsp; ◦ &nbsp;Vimeo, Twitch and Wistia player will always display controls | `false`
`light` | Set to `true` to show just the video thumbnail, which loads the full player on click<br />&nbsp; ◦ &nbsp;Pass in an image URL to override the preview image | `false`
`volume` | Set the volume of the player, between `0` and `1`<br/>&nbsp; ◦ &nbsp;`null` uses default volume on all players [`#357`](https://github.com/CookPete/react-player/issues/357) | `null`
`muted` | Mutes the player<br/>&nbsp; ◦ &nbsp;Only works if `volume` is set | `false`
`playbackRate` | Set the playback rate of the player<br />&nbsp; ◦ &nbsp;Only supported by YouTube, Wistia, and file paths | `1`
`width` | Set the width of the player | `640px`
`height` | Set the height of the player | `360px`
`style` | Add [inline styles](https://facebook.github.io/react/tips/inline-styles.html) to the root element | `{}`
`progressInterval` | The time between `onProgress` callbacks, in milliseconds | `1000`
`playsinline` | Applies the `playsinline` attribute where supported | `false`
`pip` | Set to `true` or `false` to enable or disable [picture-in-picture mode](https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture) | `false`
`wrapper` | Element or component to use as the container element | `div`
`config` | Override options for the various players, see [config prop](#config-prop)

#### Callback props

Callback props take a function that gets fired on various player events:

Prop | Description
---- | -----------
`onReady` | Called when media is loaded and ready to play. If `playing` is set to `true`, media will play immediately
`onStart` | Called when media starts playing
`onPlay` | Called when media starts or resumes playing after pausing or buffering
`onProgress` | Callback containing `played` and `loaded` progress as a fraction, and `playedSeconds` and `loadedSeconds` in seconds<br />&nbsp; ◦ &nbsp;eg `{ played: 0.12, playedSeconds: 11.3, loaded: 0.34, loadedSeconds: 16.7 }`
`onDuration` | Callback containing duration of the media, in seconds
`onPause` | Called when media is paused
`onBuffer` | Called when media starts buffering
`onBufferEnd` | Called when media has finished buffering<br />&nbsp; ◦ &nbsp;Works for files, YouTube and Facebook
`onSeek` | Called when media seeks with `seconds` parameter
`onEnded` | Called when media finishes playing<br />&nbsp; ◦ &nbsp;Does not fire when `loop` is set to `true`
`onError` | Called when an error occurs whilst attempting to play media
`onEnablePIP` | Called when picture-in-picture mode is enabled
`onDisablePIP` | Called when picture-in-picture mode is disabled

#### Config prop

As of version `0.24`, there is a single `config` prop to override the settings for the various players. If you are migrating from an earlier version, you must move all the old config props inside `config`:

```jsx
<ReactPlayer
  url={url}
  config={{
    youtube: {
      playerVars: { showinfo: 1 }
    },
    facebook: {
      appId: '12345'
    }
  }}
/>
```

The old style [config props](https://github.com/CookPete/react-player/tree/v0.23.0#config-props) still work but will produce a console warning:

```jsx
<ReactPlayer
  url={url}
  youtubeConfig={{ playerVars: { showinfo: 1 } }}
  facebookConfig={{ appId: '12345' }}
/>
```

Settings for each player live under different keys:

Key | Options
--- | -------
`youtube` | `playerVars`: Override the [default player vars](https://developers.google.com/youtube/player_parameters?playerVersion=HTML5)<br />`embedOptions`: Override the [default embed options](https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player)<br />`preload`: Used for [preloading](#preloading)
`facebook` | `appId`: Your own [Facebook app ID](https://developers.facebook.com/docs/apps/register#app-id)
`soundcloud` | `options`: Override the [default player options](https://developers.soundcloud.com/docs/api/html5-widget#params)<br />`preload`: Used for [preloading](#preloading)
`vimeo` | `playerOptions`: Override the [default params](https://developer.vimeo.com/player/embedding#universal-parameters)<br />`preload`: Used for [preloading](#preloading)
`wistia` | `options`: Override the [default player options](https://wistia.com/doc/embed-options#options_list)
`mixcloud` | `options`: Override the [default player options](https://www.mixcloud.com/developers/widget/#methods)
`dailymotion` | `params`: Override the [default player vars](https://developer.dailymotion.com/player#player-parameters)<br />`preload`: Used for [preloading](#preloading)
`twitch` | `options`: Override the [default player options](https://dev.twitch.tv/docs/embed)
`file` | `attributes`: Apply [element attributes](https://developer.mozilla.org/en/docs/Web/HTML/Element/video#Attributes)<br />`forceVideo`: Always render a `<video>` element<br />`forceAudio`: Always render an `<audio>` element<br />`forceHLS`: Use [hls.js](https://github.com/video-dev/hls.js) for HLS streams<br />`forceDASH`: Always use [dash.js](https://github.com/Dash-Industry-Forum/dash.js) for DASH streams<br />`hlsOptions`: Override the [default `hls.js` options](https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning)<br />`hlsVersion`: Override the [`hls.js`](https://github.com/video-dev/hls.js) version loaded from [`cdnjs`](https://cdnjs.com/libraries/hls.js), default: `0.10.1`<br />`dashVersion`: Override the [`dash.js`](https://github.com/Dash-Industry-Forum/dash.js) version loaded from [`cdnjs`](https://cdnjs.com/libraries/dashjs), default: `2.9.2`

##### Preloading

When `preload` is set to `true` for players that support it, a short, silent video is played in the background when `ReactPlayer` first mounts. This fixes a [bug](https://github.com/CookPete/react-player/issues/7) where videos would not play when loaded in a background browser tab.

### Methods

#### Static Methods

Method | Description
------ | -----------
`ReactPlayer.canPlay(url)` | Determine if a URL can be played. This does *not* detect media that is unplayable due to privacy settings, streaming permissions, etc. In that case, the `onError` prop will be invoked after attemping to play. Any URL that does not match any patterns will fall back to a native HTML5 media player.
`ReactPlayer.canEnablePiP(url)` | Determine if a URL can be played in [picture-in-picture mode](https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture)
`ReactPlayer.addCustomPlayer(CustomPlayer)` | Add a custom player. See [Adding custom players](#adding-custom-players)
`ReactPlayer.removeCustomPlayers()` | Remove any players that have been added using `addCustomPlayer()`

#### Instance Methods

Use [`ref`](https://facebook.github.io/react/docs/refs-and-the-dom.html) to call instance methods on the player. See [the demo app](src/demo/App.js) for an example of this.

Method | Description
------ | -----------
`seekTo(amount, type)` | Seek to the given number of seconds, or fraction if `amount` is between `0` and `1`<br />&nbsp; ◦ &nbsp;`type` parameter lets you specify `'seconds'` or `'fraction'` to override default behaviour
`getCurrentTime()` | Returns the number of seconds that have been played<br />&nbsp; ◦ &nbsp;Returns `null` if unavailable
`getSecondsLoaded()` | Returns the number of seconds that have been loaded<br />&nbsp; ◦ &nbsp;Returns `null` if unavailable or unsupported
`getDuration()` | Returns the duration (in seconds) of the currently playing media<br />&nbsp; ◦ &nbsp;Returns `null` if duration is unavailable
`getInternalPlayer()` | Returns the internal player of whatever is currently playing<br />&nbsp; ◦ &nbsp;eg the [YouTube player instance](https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player), or the [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) element when playing a video file<br />&nbsp; ◦ &nbsp;Use `getInternalPlayer('hls')` to get the [hls.js](https://github.com/video-dev/hls.js) player<br />&nbsp; ◦ &nbsp;Use `getInternalPlayer('dash')` to get the [dash.js](https://github.com/Dash-Industry-Forum/dash.js) player<br />&nbsp; ◦ &nbsp;Returns `null` if the internal player is unavailable

### Advanced Usage

#### Light player

The `light` prop will render a video thumbnail with simple play icon, and only load the full player once a user has interacted with the image. [Noembed](https://noembed.com) is used to fetch thumbnails for a video URL. Note that automatic thumbnail fetching for Facebook, Wistia, Mixcloud and file URLs are not supported, and ongoing support for other URLs is not guaranteed.

If you want to pass in your own thumbnail to use, set `light` to the image URL rather than `true`.

The styles for the preview image and play icon can be overridden by targeting the CSS classes `react-player__preview`, `react-player__shadow` and `react-player__play-icon`.

#### Responsive player

Set `width` and `height` to `100%` and wrap the player in a [fixed aspect ratio box](https://css-tricks.com/aspect-ratio-boxes) to get a responsive player:

```js
class ResponsivePlayer extends Component {
  render () {
    return (
      <div className='player-wrapper'>
        <ReactPlayer
          className='react-player'
          url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
          width='100%'
          height='100%'
        />
      </div>
    )
  }
}
```

```css
.player-wrapper {
  position: relative;
  padding-top: 56.25% /* Player ratio: 100 / (1280 / 720) */
}

.react-player {
  position: absolute;
  top: 0;
  left: 0;
}
```

See [`jsFiddle` example](https://jsfiddle.net/e6w3rtj1/)

#### Single player imports

If you are only ever playing a single type of URL, you can import individual players to keep your bundle size down:

```jsx
import YouTubePlayer from 'react-player/lib/players/YouTube'

<YouTubePlayer
  url='https://www.youtube.com/watch?v=d46Azg3Pm4c'
  playing
  controls
  // Other ReactPlayer props will work here
/>
```

See a list of available players [here](https://github.com/CookPete/react-player/tree/master/src/players).

#### Standalone player

If you aren’t using React, you can still render a player using the standalone library:

```html
<script src='https://unpkg.com/react-player/dist/ReactPlayer.standalone.js'></script>
<script>
  const container = document.getElementById('container')
  const url = 'https://www.youtube.com/watch?v=d46Azg3Pm4c'

  renderReactPlayer(container, { url, playing: true })

  function pausePlayer () {
    renderReactPlayer(container, { url, playing: false })
  }
</script>
```

See [`jsFiddle` example](https://jsfiddle.net/krkcvx9s/)

#### Adding custom players

If you have your own player that is compatible with ReactPlayer’s internal architecture, you can add it using `addCustomPlayer`:

```javascript
import YourOwnPlayer from './somewhere';
ReactPlayer.addCustomPlayer(YourOwnPlayer);
```

Use `removeCustomPlayers` to clear all custom players:

```javascript
ReactPlayer.removeCustomPlayers();
```

It is your responsibility to ensure that custom players keep up with any internal changes to ReactPlayer in later versions.

#### Using Bower

```bash
bower install react-player --save
```

```html
<script src='bower_components/react/react.js'></script>
<script src='bower_components/react/react-dom.js'></script>
<script src='bower_components/react-player/dist/ReactPlayer.js'></script>
<script>
  ReactDOM.render(
    <ReactPlayer url='https://www.youtube.com/watch?v=d46Azg3Pm4c' playing />,
    document.getElementById('container')
  )
</script>
```

#### Mobile considerations

Due to various restrictions, `ReactPlayer` is not guaranteed to function properly on mobile devices. The [YouTube player documentation](https://developers.google.com/youtube/iframe_api_reference), for example, explains that [certain mobile browsers require user interaction](https://developers.google.com/youtube/iframe_api_reference#Mobile_considerations) before playing:

> The HTML5 `<video>` element, in certain mobile browsers (such as Chrome and Safari), only allows playback to take place if it’s initiated by a user interaction (such as tapping on the player).

#### Multiple Sources and Tracks

When playing file paths, an array of sources can be passed to the `url` prop to render multiple `<source>` tags.

```jsx
<ReactPlayer playing url={['foo.webm', 'foo.ogg']} />
```

You can also specify a `type` for each source by using objects with `src` and `type` properties.

```jsx
<ReactPlayer
  playing
  url={[
    {src: 'foo.webm', type: 'video/webm'},
    {src: 'foo.ogg', type: 'video/ogg'}
  ]}
/>
```

[`<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track) elements for subtitles can be added using `fileConfig`:

```jsx
<ReactPlayer
  playing
  url='foo.webm'
  config={{ file: {
    tracks: [
      {kind: 'subtitles', src: 'subs/subtitles.en.vtt', srcLang: 'en', default: true},
      {kind: 'subtitles', src: 'subs/subtitles.ja.vtt', srcLang: 'ja'},
      {kind: 'subtitles', src: 'subs/subtitles.de.vtt', srcLang: 'de'}
    ]
  }}}
/>
```

### Supported media

* YouTube videos use the [YouTube iFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
* Facebook videos use the [Facebook Embedded Video Player API](https://developers.facebook.com/docs/plugins/embedded-video-player/api)
* SoundCloud tracks use the [SoundCloud Widget API](https://developers.soundcloud.com/docs/api/html5-widget)
* Streamable videos use [`Player.js`](https://github.com/embedly/player.js)
* Vidme videos are [no longer supported](https://medium.com/vidme/goodbye-for-now-120b40becafa)
* Vimeo videos use the [Vimeo Player API](https://developer.vimeo.com/player/js-api)
* Wistia videos use the [Wistia Player API](https://wistia.com/doc/player-api)
* Twitch videos use the [Twitch Interactive Frames API](https://dev.twitch.tv/docs/embed#interactive-frames-for-live-streams-and-vods)
* DailyMotion videos use the [DailyMotion Player API](https://developer.dailymotion.com/player)
* [Supported file types](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats) are playing using [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) or [`<audio>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/audio) elements
  * HLS streams are played using [`hls.js`](https://github.com/video-dev/hls.js)
  * DASH streams are played using [`dash.js`](https://github.com/Dash-Industry-Forum/dash.js)

### Contributing

See the [contribution guidelines](https://github.com/CookPete/react-player/blob/master/CONTRIBUTING.md) before creating a pull request.

### Thanks

- Many thanks to [Kostya Luchankin](https://github.com/phationmationion) for help overhauling the player inheritance patterns.
- Thanks to anyone who has [contributed](https://github.com/CookPete/react-player/graphs/contributors).
