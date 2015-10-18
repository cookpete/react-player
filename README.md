react-player
============

A react component for playing media from YouTube, SoundCloud and Vimeo, as well as supported media files.

The component parses a URL and loads in the appropriate markup and external SDKs to play media from [various sources](#Supported Media). [Props](#Props) can be passed in to control playback and react to events such as buffering or media ending.

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

See `App.js` for a full example

### Demo

The quickest way to see it in action is to checkout the repo and run the demo:

```bash
git clone http://github.com/cookpete/react-player
cd react-player
npm install
npm start
open http://localhost:3000
```

### Props

Prop | Description
---- | -----------
url | The url of a video or song to play
playing | Set to `true` or `false` to pause or play the media
volume | Sets the volume of the appropriate player
width | Sets the width of the player
height | Sets the height of the player
soundcloudConfig | An object containing configuration for the SoundCloud player. Includes `clientId`, which can be used to override the default `client_id`
vimeoConfig | An object containing configuration for the Vimeo player. Includes `iframeParams`, which maps to the [parameters accepted by the Vimeo iframe player](https://developer.vimeo.com/player/embedding#universal-parameters)
youtubeConfig | An object containing configuration for the YouTube player. Includes `playerVars`, which maps to the [parameters accepted by the YouTube iframe player](https://developers.google.com/youtube/player_parameters?playerVersion=HTML5)
onProgress | Callback containing `played` and `loaded` progress as a fraction eg `{ played: 0.12, loaded: 0.34 }`
onPlay | Called when media starts or resumes playing after pausing or buffering
onPause | Called when media is paused
onBuffer | Called when media starts buffering
onEnded | Called when media finishes playing
onError | Called when an error occurs whilst attempting to play media

### Methods

There is a static method  `ReactPlayer.canPlay(url)` to determine if a URL can be played by the media player. Note that this does *not* detect media that is unplayable due to streaming permissions etc. In that case, `onError` will occur after attemping to play.

To seek to a certain part of the media, there is a `seekTo(fraction)` instance method that will seek to the appropriate place in the media. See `App.js` for an example of this using `refs`.

### Supported Media

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

* Big thanks to [gaearon](https://github.com/gaearon) for his [react-hot-boilerplate](https://github.com/gaearon/react-hot-boilerplate), which this repo is roughly based on.
