ReactPlayer
===========

[![Latest npm version](https://img.shields.io/npm/v/react-player.svg)](https://www.npmjs.com/package/react-player)
[![Build Status](https://img.shields.io/travis/CookPete/react-player/master.svg)](https://travis-ci.org/CookPete/react-player)
[![Dependency Status](https://img.shields.io/david/CookPete/react-player.svg)](https://david-dm.org/CookPete/react-player)
[![devDependency Status](https://img.shields.io/david/dev/CookPete/react-player.svg)](https://david-dm.org/CookPete/react-player?type=dev)

A react component for playing a variety of URLs, including file paths, YouTube, Facebook, SoundCloud, Streamable, Vidme, Vimeo, Wistia and DailyMotion. Used by [rplayr](http://rplayr.com), an app to generate playlists from Reddit URLs.

The component parses a URL and loads in the appropriate markup and external SDKs to play media from [various sources](#supported-media). [Props](#props) can be passed in to control playback and react to events such as buffering or media ending.

### Polyfills

If you are using `npm` and need to support [browsers without `Promise`](http://caniuse.com/#feat=promises) you will need a [`Promise` polyfill](https://github.com/stefanpenner/es6-promise). To support `Streamable` or `Vidme` videos you will also need a [`fetch` polyfill](https://github.com/github/fetch) for [browsers without `fetch`](http://caniuse.com/#feat=fetch)

### Usage

```bash
npm install react-player --save
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

For platforms like [Meteor](https://www.meteor.com) without direct use of `npm` modules, a minified version of `ReactPlayer` is located in `dist` after installing. To generate this file yourself, checkout the repo and run `npm run build:browser`

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
npm install
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
`controls` | Set to `true` or `false` to display native player controls<br />*Note: Vimeo player controls are not configurable and will always display* | `false`
`volume` | Sets the volume of the appropriate player | `0.8`
`playbackRate` | Sets the playback rate of the appropriate player | `1`
`width` | Sets the width of the player | `640`
`height` | Sets the height of the player | `360`
`style` | Add [inline styles](https://facebook.github.io/react/tips/inline-styles.html) to the root element
`progressFrequency` | The time between `onProgress` callbacks, in milliseconds | `1000`
`playsinline` | Applies the `playsinline` attribute where supported | `false`

#### Callback props

Callback props take a function that gets fired on various player events:

Prop | Description
---- | -----------
`onReady` | Called when media is loaded and ready to play. If `playing` is set to `true`, media will play immediately
`onStart` | Called when media starts playing
`onPlay` | Called when media starts or resumes playing after pausing or buffering
`onProgress` | Callback containing progress `played`, `loaded` (fraction), `playedSeconds` and `loadedSeconds` (seconds)<br />eg `{ played: 0.12, playedSeconds: 11.3, loaded: 0.34, loadedSeconds: 16.7 }`
`onDuration` | Callback containing duration of the media, in seconds
`onPause` | Called when media is paused
`onBuffer` | Called when media starts buffering
`onEnded` | Called when media finishes playing
`onError` | Called when an error occurs whilst attempting to play media

#### Config props

These props allow you to override the parameters for the various players:

Prop | Description
---- | -----------
`soundcloudConfig` | Configuration object for the SoundCloud player.<br />Set `clientId` to your own SoundCloud app [client ID](https://soundcloud.com/you/apps).<br />Set `showArtwork` to `false` to not load any artwork to display.
`vimeoConfig` | Configuration object for the Vimeo player.<br />Set `iframeParams` to override the [default params](https://developer.vimeo.com/player/embedding#universal-parameters).<br />Set `preload` for [preloading](#preloading).
`youtubeConfig` | Configuration object for the YouTube player.<br />Set `playerVars` to override the [default player vars](https://developers.google.com/youtube/player_parameters?playerVersion=HTML5).<br />Set `preload` for [preloading](#preloading).
`vidmeConfig` | Configuration object for the Vidme player.<br />Set `format` to use a certain quality of video, when available.<br />Possible values: `240p`, `480p`, `720p`, `1080p`, `dash`, `hls`
`wistiaConfig` | Configuration object for the Wistia player.<br />Set `options` to override the [default player options](https://wistia.com/doc/embed-options#options_list)
`dailymotionConfig` | Configuration object for the DailyMotion player.<br />Set `params` to override the [default player vars](https://developer.dailymotion.com/player#player-parameters).<br />Set `preload` for [preloading](#preloading).
`fileConfig` | Configuration object for the file player.<br />Set `attributes` to apply [element attributes](https://developer.mozilla.org/en/docs/Web/HTML/Element/video#Attributes).<br />Set `forceAudio` to always render an `<audio>` element.<br />Set `forceHLS` to use [hls.js](https://github.com/video-dev/hls.js) for HLS streams.<br />Set `forceDASH` to always use [dash.js](https://github.com/Dash-Industry-Forum/dash.js) for DASH streams.
`facebookConfig` | Configuration object for the Facebook player.<br />Set `appId` to your own [Facebook app ID](https://developers.facebook.com/docs/apps/register#app-id).

##### Preloading

Both `youtubeConfig`, `vimeoConfig`, `dailymotionConfig` props can take a `preload` value. Setting this to `true` will play a short, silent video in the background when `ReactPlayer` first mounts. This fixes a [bug](https://github.com/CookPete/react-player/issues/7) where videos would not play when loaded in a background browser tab.

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
  fileConfig={{
    tracks: [
      {kind: 'subtitles', src: 'subs/subtitles.en.vtt', srcLang: 'en', default: true},
      {kind: 'subtitles', src: 'subs/subtitles.ja.vtt', srcLang: 'ja'},
      {kind: 'subtitles', src: 'subs/subtitles.de.vtt', srcLang: 'de'}
    ]
  }}
/>
```


### Methods

Use [`ref`](https://facebook.github.io/react/docs/refs-and-the-dom.html) to call methods on the player. See [the demo app](src/demo/App.js) for an example of this.

Prop | Description
---- | -----------
`seekTo(amount)` | Seek to the given number of seconds, or fraction if `amount` is between `0` and `1`.
`getCurrentTime()` | Returns the number of seconds that has been played.<br >Returns `null` if duration is unavailable.
`getDuration()` | Returns the duration (in seconds) of the currently playing media.<br >Returns `null` if duration is unavailable.

### Supported media

* YouTube videos use the [YouTube iFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
* Facebook videos use the [Facebook Embedded Video Player API](https://developers.facebook.com/docs/plugins/embedded-video-player/api)
* Soundcloud tracks are [resolved](https://developers.soundcloud.com/docs/api/reference#resolve) and played in an [`<audio>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/audio) element using the track’s `stream_url`
* Streamable videos are [resolved](https://streamable.com/documentation#retrieve-video) and played in a [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) element using the track’s `mp4` path
* Vidme videos are [resolved](https://docs.vid.me/#api-Video-DetailByURL) and played in a [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) element using the track’s `complete_url` path
* Vimeo videos use the [Vimeo Player API](https://developer.vimeo.com/player/js-api)
* Wistia videos use the [Wistia Player API](https://wistia.com/doc/player-api)
* DailyMotion videos use the [DailyMotion Player API](https://developer.dailymotion.com/player)
* [Supported file types](https://github.com/CookPete/react-player/blob/master/src/players/FilePlayer.js#L5-L6) are playing using [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) or [`<audio>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/audio) elements
  * HLS streams are played using [hls.js](https://github.com/video-dev/hls.js)
  * DASH streams are played using [dash.js](https://github.com/Dash-Industry-Forum/dash.js)

### Contributing

See the [contribution guidelines](https://github.com/CookPete/react-player/blob/master/CONTRIBUTING.md) before creating a pull request.

### Thanks

* Anyone who has [contributed](https://github.com/CookPete/react-player/graphs/contributors)
* [gaearon](https://github.com/gaearon) for his [react-transform-boilerplate](https://github.com/gaearon/react-transform-boilerplate), which this repo is roughly based on.
