ReactPlayer
===========

[![Latest npm version](https://img.shields.io/npm/v/react-player.svg)](https://www.npmjs.com/package/react-player)
[![Build Status](https://img.shields.io/travis/CookPete/react-player/master.svg)](https://travis-ci.org/CookPete/react-player)
[![Dependency Status](https://img.shields.io/david/CookPete/react-player.svg)](https://david-dm.org/CookPete/react-player)
[![devDependency Status](https://img.shields.io/david/dev/CookPete/react-player.svg)](https://david-dm.org/CookPete/react-player?type=dev)

A react component for playing a variety of URLs, including file paths, YouTube, SoundCloud, Streamable, Vidme, Vimeo and Wistia. Used by [rplayr](http://rplayr.com), an app to generate playlists from Reddit URLs.

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
`hidden` | Set to `true` to hide the player | `false`
`className` | Pass in a `className` to set on the root element
`style` | Add [inline styles](https://facebook.github.io/react/tips/inline-styles.html) to the root element
`progressFrequency` | The time between `onProgress` callbacks, in milliseconds | `1000`

#### Callback props

Callback props take a function that gets fired on various player events:

Prop | Description
---- | -----------
`onReady` | Called when media is loaded and ready to play. If `playing` is set to `true`, media will play immediately
`onStart` | Called when media starts playing
`onPlay` | Called when media starts or resumes playing after pausing or buffering
`onProgress` | Callback containing `played` and `loaded` progress as a fraction<br />eg `{ played: 0.12, loaded: 0.34 }`
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
`fileConfig` | Configuration object for the file player.<br />Set `attributes` to apply [element attributes](https://developer.mozilla.org/en/docs/Web/HTML/Element/video#Attributes).

##### Preloading

Both `youtubeConfig` and `vimeoConfig` props can take a `preload` value. Setting this to `true` will play a short, silent video in the background when `ReactPlayer` first mounts. This fixes a [bug](https://github.com/CookPete/react-player/issues/7) where videos would not play when loaded in a background browser tab.

### Methods

To seek to a certain part of the media, there is a `seekTo(fraction)` instance method that will seek to the appropriate place in the media. See `App.js` for an example of this using `refs`.

### Supported media

* YouTube videos use the [YouTube iFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
* Soundcloud tracks are [resolved](https://developers.soundcloud.com/docs/api/reference#resolve) and played in an [`<audio>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/audio) element using the track’s `stream_url`
* Streamable videos are [resolved](https://streamable.com/documentation#retrieve-video) and played in a [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) element using the track’s `mp4` path
* Vidme videos are [resolved](https://docs.vid.me/#api-Video-DetailByURL) and played in a [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) element using the track’s `complete_url` path
* Vimeo videos use the [Vimeo Player API](https://developer.vimeo.com/player/js-api)
* Wistia videos use the [Wistia Player API](https://wistia.com/doc/player-api)
* [Supported file types](https://github.com/CookPete/react-player/blob/master/src/players/FilePlayer.js#L5-L6) are playing using [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) or [`<audio>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/audio) elements

### Contributing

See the [contribution guidelines](https://github.com/CookPete/react-player/blob/master/CONTRIBUTING.md) before creating a pull request.

### Thanks

* Anyone who has [contributed](https://github.com/CookPete/react-player/graphs/contributors)
* [gaearon](https://github.com/gaearon) for his [react-transform-boilerplate](https://github.com/gaearon/react-transform-boilerplate), which this repo is roughly based on.
