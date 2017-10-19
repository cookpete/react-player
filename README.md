ReactPlayer
===========

[![Latest npm version](https://img.shields.io/npm/v/react-player.svg)](https://www.npmjs.com/package/react-player)
[![Build Status](https://img.shields.io/travis/CookPete/react-player/master.svg)](https://travis-ci.org/CookPete/react-player)
[![Dependency Status](https://img.shields.io/david/CookPete/react-player.svg)](https://david-dm.org/CookPete/react-player)
[![devDependency Status](https://img.shields.io/david/dev/CookPete/react-player.svg)](https://david-dm.org/CookPete/react-player?type=dev)
[![Test Coverage](https://img.shields.io/codecov/c/github/cookpete/react-player.svg)](https://codecov.io/gh/CookPete/react-player)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://paypal.me/ckpt)

A react component for playing a variety of URLs, including file paths, YouTube, Facebook, Twitch, SoundCloud, Streamable, Vidme, Vimeo, Wistia and DailyMotion.

The component parses a URL and loads in the appropriate markup and external SDKs to play media from [various sources](#supported-media). [Props](#props) can be passed in to control playback and react to events such as buffering or media ending.

### Polyfills

* If you are using `npm` and need to support [browsers without `Promise`](http://caniuse.com/#feat=promises) you will need a [`Promise` polyfill](https://github.com/stefanpenner/es6-promise).
* To support `Vidme` videos you will need a [`fetch` polyfill](https://github.com/github/fetch) for [browsers without `fetch`](http://caniuse.com/#feat=fetch)
* To support IE11 you will need to use [`babel-polyfill`](https://babeljs.io/docs/usage/polyfill) or a similar ES2015+ polyfill.

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

See [the demo source](https://github.com/CookPete/react-player/blob/master/src/demo/App.js) for a full example.

For platforms like [Meteor](https://www.meteor.com) without direct use of `npm` modules, a minified version of `ReactPlayer` is located in `dist` after installing. To generate this file yourself, checkout the repo and run `npm run build:dist`

#### Bower

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

### Demo

See a [live demo](http://cookpete.com/react-player), or run:

```bash
git clone https://github.com/CookPete/react-player.git
cd react-player
npm install # or yarn
npm start
open http://localhost:3000
```

### Mobile considerations

Due to various restrictions, `ReactPlayer` is not guaranteed to function properly on mobile devices. The [YouTube player documentation](https://developers.google.com/youtube/iframe_api_reference), for example, explains that [certain mobile browsers require user interaction](https://developers.google.com/youtube/iframe_api_reference#Mobile_considerations) before playing:

> The HTML5 `<video>` element, in certain mobile browsers (such as Chrome and Safari), only allows playback to take place if it's initiated by a user interaction (such as tapping on the player).

### Props

Prop | Description | Default
---- | ----------- | -------
`url` | The url of a video or song to play
`playing` | Set to `true` or `false` to pause or play the media | `false`
`loop` | Set to `true` or `false` to loop the media | `false`
`controls` | Set to `true` or `false` to display native player controls<br />*Note: Vimeo, Twitch and Wistia player controls are not configurable and will always display* | `false`
`volume` | Sets the volume of the appropriate player | `0.8`
`muted` | Mutes the player | `false`
`playbackRate` | Sets the playback rate of the appropriate player<br />*Note: Only supported by YouTube, Wistia, and file paths* | `1`
`width` | Sets the width of the player | `640`
`height` | Sets the height of the player | `360`
`style` | Add [inline styles](https://facebook.github.io/react/tips/inline-styles.html) to the root element | `{}`
`progressFrequency` | The time between `onProgress` callbacks, in milliseconds | `1000`
`playsinline` | Applies the `playsinline` attribute where supported | `false`
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
`onSeek` | Called when media seeks with `seconds` parameter
`onEnded` | Called when media finishes playing
`onError` | Called when an error occurs whilst attempting to play media

#### Config prop

As of version `0.24`, there is a single `config` prop to override the settings for the various players. If you are migrating from an earlier version, you must move all the old config props inside `config`:

```js
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

```js
<ReactPlayer
  url={url}
  youtubeConfig={{ playerVars: { showinfo: 1 } }}
  facebookConfig={{ appId: '12345' }}
/>
```

Settings for each player live under different keys:

Key | Options
--- | -------
`youtube` | `playerVars`: Override the [default player vars](https://developers.google.com/youtube/player_parameters?playerVersion=HTML5)<br />`preload`: Used for [preloading](#preloading)
`facebook` | `appId`: Your own [Facebook app ID](https://developers.facebook.com/docs/apps/register#app-id)
`soundcloud` | `options`: Override the [default player options](https://developers.soundcloud.com/docs/api/html5-widget#params)
`vimeo` | `playerOptions`: Override the [default params](https://developer.vimeo.com/player/embedding#universal-parameters)<br />`preload`: Used for [preloading](#preloading).
`vidme` | `format`: Use a certain quality of video, when available<br />&nbsp; ◦ &nbsp;Possible values: `240p`, `480p`, `720p`, `1080p`, `dash`, `hls`
`wistia` | `options`: Override the [default player options](https://wistia.com/doc/embed-options#options_list)
`dailymotion` | `params`: Override the [default player vars](https://developer.dailymotion.com/player#player-parameters)<br />`preload`: Used for [preloading](#preloading)
`file` | `attributes`: Apply [element attributes](https://developer.mozilla.org/en/docs/Web/HTML/Element/video#Attributes)<br />`forceAudio`: Always render an `<audio>` element<br />`forceHLS`: Use [hls.js](https://github.com/video-dev/hls.js) for HLS streams<br />`forceDASH`: Always use [dash.js](https://github.com/Dash-Industry-Forum/dash.js) for DASH streams

##### Preloading

When `preload` is set to `true` for players that support it, a short, silent video is played in the background when `ReactPlayer` first mounts. This fixes a [bug](https://github.com/CookPete/react-player/issues/7) where videos would not play when loaded in a background browser tab.

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


### Methods

#### Static Methods

Method | Description
---- | -----------
`ReactPlayer.canPlay(url)` | Determine if a URL can be played. This does *not* detect media that is unplayable due to privacy settings, streaming permissions, etc. In that case, the `onError` prop will be invoked after attemping to play. Any URL that does not match any patterns will fall back to a native HTML5 media player.

#### Instance Methods

Use [`ref`](https://facebook.github.io/react/docs/refs-and-the-dom.html) to call instance methods on the player. See [the demo app](src/demo/App.js) for an example of this.

Method | Description
---- | -----------
`seekTo(amount)` | Seek to the given number of seconds, or fraction if `amount` is between `0` and `1`
`getCurrentTime()` | Returns the number of seconds that has been played<br />&nbsp; ◦ &nbsp;Returns `null` if duration is unavailable
`getDuration()` | Returns the duration (in seconds) of the currently playing media<br />&nbsp; ◦ &nbsp;Returns `null` if duration is unavailable
`getInternalPlayer()` | Returns the internal player of whatever is currently playing<br />&nbsp; ◦ &nbsp;eg the [YouTube player instance](https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player), or the [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) element when playing a video file<br />&nbsp; ◦ &nbsp;Use `getInternalPlayer('hls')` to get the [hls.js](https://github.com/video-dev/hls.js) player<br />&nbsp; ◦ &nbsp;Use `getInternalPlayer('dash')` to get the [dash.js](https://github.com/Dash-Industry-Forum/dash.js) player

### Supported media

* YouTube videos use the [YouTube iFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
* Facebook videos use the [Facebook Embedded Video Player API](https://developers.facebook.com/docs/plugins/embedded-video-player/api)
* SoundCloud tracks use the [SoundCloud Widget API](https://developers.soundcloud.com/docs/api/html5-widget)
* Streamable videos are [resolved](https://streamable.com/documentation#retrieve-video) and played in a [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) element using the track’s `mp4` path
* Vidme videos are [resolved](https://docs.vid.me/#api-Video-DetailByURL) and played in a [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) element using the track’s `complete_url` path
* Vimeo videos use the [Vimeo Player API](https://developer.vimeo.com/player/js-api)
* Wistia videos use the [Wistia Player API](https://wistia.com/doc/player-api)
* Twitch videos use the [Twitch Interactive Frames API](https://dev.twitch.tv/docs/embed#interactive-frames-for-live-streams-and-vods)
* DailyMotion videos use the [DailyMotion Player API](https://developer.dailymotion.com/player)
* [Supported file types](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats) are playing using [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) or [`<audio>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/audio) elements
  * HLS streams are played using [hls.js](https://github.com/video-dev/hls.js)
  * DASH streams are played using [dash.js](https://github.com/Dash-Industry-Forum/dash.js)

### Contributing

See the [contribution guidelines](https://github.com/CookPete/react-player/blob/master/CONTRIBUTING.md) before creating a pull request.

### Thanks

Huge thanks to anyone who has [contributed](https://github.com/CookPete/react-player/graphs/contributors)
