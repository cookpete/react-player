ReactPlayer
===========

[![Latest npm version](https://img.shields.io/npm/v/react-player.svg)](https://www.npmjs.com/package/react-player)
[![Build Status](https://img.shields.io/travis/CookPete/react-player/master.svg)](https://travis-ci.org/CookPete/react-player)
[![Dependency Status](https://img.shields.io/david/CookPete/react-player.svg)](https://david-dm.org/CookPete/react-player)
[![devDependency Status](https://img.shields.io/david/dev/CookPete/react-player.svg)](https://david-dm.org/CookPete/react-player#info=devDependencies)

A react component for playing media from YouTube, SoundCloud and Vimeo, as well as supported media files.

The component parses a URL and loads in the appropriate markup and external SDKs to play media from [various sources](#supported-media). [Props](#props) can be passed in to control playback and react to events such as buffering or media ending.

### Usage

```bash
npm install react-player --save
```

```js
import React, { Component } from 'react'
import ReactPlayer from 'react-player'

class App extends Component {
  render () {
    <ReactPlayer
      url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
      playing={true}
    />
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

Prop | Description
---- | -----------
`url` | The url of a video or song to play
`playing` | Set to `true` or `false` to pause or play the media
`volume` | Sets the volume of the appropriate player
`width` | Sets the width of the player
`height` | Sets the height of the player
`className` | Pass in a `className` to set on the top level element

#### Callback props

Callback props take a function that gets fired on various player events

Prop | Description
---- | -----------
`onProgress` | Callback containing `played` and `loaded` progress as a fraction<br/>eg `{ played: 0.12, loaded: 0.34 }`
`onDuration` | Callback containing duration of the media, in seconds
`onPlay` | Called when media starts or resumes playing after pausing or buffering
`onPause` | Called when media is paused
`onBuffer` | Called when media starts buffering
`onEnded` | Called when media finishes playing
`onError` | Called when an error occurs whilst attempting to play media

#### Config props

These props allow you to override the parameters for the various players

Prop | Description
---- | -----------
`soundcloudConfig` | Configuration object for the SoundCloud player. Set `clientId`, to your own SoundCloud app [client ID](https://soundcloud.com/you/apps)
`vimeoConfig` | Configuration object for the Vimeo player. Set `iframeParams`, to override the [default params](https://developer.vimeo.com/player/embedding#universal-parameters). Set `preload` for [preloading](#preloading)
`youtubeConfig` | Configuration object for the YouTube player. Set `playerVars`, to override the [default player vars](https://developers.google.com/youtube/player_parameters?playerVersion=HTML5). Set `preload` for [preloading](#preloading)

##### Preloading

Both `youtubeConfig` and `vimeoConfig` props can take a `preload` value. Setting this to `true` will play a short, silent video in the background when `ReactPlayer` first mounts. This fixes a [bug](https://github.com/CookPete/react-player/issues/7) where videos would not play when loaded in a background browser tab.

### Methods

There is a static method  `ReactPlayer.canPlay(url)` to determine if a URL can be played by the media player. Note that this does *not* detect media that is unplayable due to streaming permissions etc. In that case, `onError` will occur after attemping to play.

To seek to a certain part of the media, there is a `seekTo(fraction)` instance method that will seek to the appropriate place in the media. See `App.js` for an example of this using `refs`.

### Supported media

* YouTube videos use the [YouTube iFrame Player API]()
* Soundcloud tracks use the [Soundcloud JS SDK 2.0]()
* Vimeo videos use the [Vimeo Player API]()
* MP4/WEBM/OGG/MP3/WAV files use the [HTML media object]()

### Linting

This project uses [standard](https://github.com/feross/standard) code style.

```bash
npm run lint
```

### Testing

This project uses [mocha](https://github.com/mochajs/mocha) with [chai](https://github.com/chaijs/chai) assertions for unit testing.

```bash
npm run test
```

### Thanks

* [gaearon](https://github.com/gaearon) for his [react-transform-boilerplate](https://github.com/gaearon/react-transform-boilerplate), which this repo is roughly based on.
* [Simon Smith](http://simonsmith.io) for his [intro to react testing with shallow rendering](http://simonsmith.io/unit-testing-react-components-without-a-dom/)
* [Fauntleroy](https://github.com/Fauntleroy) for his contributions
