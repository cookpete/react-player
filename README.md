<h1 align='center'>
  ReactPlayer
</h1>

<p align='center'>
  <a href='https://www.npmjs.com/package/react-player'><img src='https://img.shields.io/npm/v/react-player.svg' alt='Latest npm version'></a>
  <a href='https://codecov.io/gh/CookPete/react-player'><img src='https://img.shields.io/codecov/c/github/cookpete/react-player.svg' alt='Test Coverage'></a>
  <a href='https://www.patreon.com/cookpete'><img src='https://img.shields.io/badge/sponsor-patreon-fa6854.svg' alt='Become a sponsor on Patreon'></a>
</p>

<p align='center'>
  A React component for playing a variety of URLs, including file paths, YouTube, Facebook, Twitch, SoundCloud, Streamable, Vimeo, Wistia, Mixcloud, DailyMotion and Kaltura. Not using React? <a href='#standalone-player'>No problem.</a>
</p>

---

> Using Next.js and need to handle video upload/processing? Check out [next-video](https://github.com/muxinc/next-video).

### ✨ The future of ReactPlayer

Maintenance of ReactPlayer is being taken over by [Mux](https://www.mux.com). Mux is a [video api](https://www.mux.com/video-api) for developers. The team at Mux have worked on many highly respected projects and are committed to improving video tooling for developers.

ReactPlayer will remain open source, but with a higher rate of fixes and releases over time. Thanks to everyone in the community for your ongoing support.

### Usage

```bash
npm install react-player # or yarn add react-player
```

```jsx
import React from 'react'
import ReactPlayer from 'react-player'

// Render a YouTube video player
<ReactPlayer url='https://www.youtube.com/watch?v=LXb3EKWsInQ' />
```

If your build system supports `import()` statements and code splitting enable this to lazy load the appropriate player for the `url` you pass in. This adds several `reactPlayer` chunks to your output, but reduces your main bundle size.

Demo page: [`https://cookpete.github.io/react-player`](https://cookpete.github.io/react-player)

The component parses a URL and loads in the appropriate markup and external SDKs to play media from [various sources](#supported-media). [Props](#props) can be passed in to control playback and react to events such as buffering or media ending. See [the demo source](https://github.com/cookpete/react-player/blob/master/examples/react/src/App.js) for a full example.

For platforms without direct use of `npm` modules, a minified version of `ReactPlayer` is located in `dist` after installing. To generate this file yourself, checkout the repo and run `npm run build:dist`.

#### Autoplay

As of Chrome 66, [videos must be `muted` in order to play automatically](https://www.theverge.com/2018/3/22/17150870/google-chrome-autoplay-videos-sound-mute-update). Some players, like Facebook, cannot be unmuted until the user interacts with the video, so you may want to enable `controls` to allow users to unmute videos themselves. Please set `muted={true}`.

### Props

Prop | Description | Default
---- | ----------- | -------
`url` | The url of a video or song to play<br/>&nbsp; ◦ &nbsp;Can be an [array](#multiple-sources-and-tracks) or [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) object
`playing` | Set to `true` or `false` to pause or play the media | `false`
`loop` | Set to `true` or `false` to loop the media | `false`
`controls` | Set to `true` or `false` to display native player controls.<br/>&nbsp; ◦ &nbsp;For Vimeo videos, hiding controls must be enabled by the video owner. | `false`
`light` | Set to `true` to show just the video thumbnail, which loads the full player on click<br />&nbsp; ◦ &nbsp;Pass in an image URL to override the preview image | `false`
`volume` | Set the volume of the player, between `0` and `1`<br/>&nbsp; ◦ &nbsp;`null` uses default volume on all players [`#357`](https://github.com/cookpete/react-player/issues/357) | `null`
`muted` | Mutes the player<br/>&nbsp; ◦ &nbsp;Only works if `volume` is set | `false`
`playbackRate` | Set the playback rate of the player<br />&nbsp; ◦ &nbsp;Only supported by YouTube, Wistia, and file paths | `1`
`width` | Set the width of the player | `640px`
`height` | Set the height of the player | `360px`
`style` | Add [inline styles](https://facebook.github.io/react/tips/inline-styles.html) to the root element | `{}`
`playsInline` | Applies the `playsInline` attribute where supported | `false`
`pip` | Set to `true` or `false` to enable or disable [picture-in-picture mode](https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture)<br/>&nbsp; ◦ &nbsp;Only available when playing file URLs in [certain browsers](https://caniuse.com/#feat=picture-in-picture) | `false`
`fallback` | Element or component to use as a fallback if you are using lazy loading | `null`
`wrapper` | Element or component to use as the container element | `div`
`playIcon` | Element or component to use as the play icon in light mode
`previewTabIndex` | Set the tab index to be used on light mode | 0

#### Callback props

Callback props take a function that gets fired on various player events:

Prop | Description
---- | -----------
`onClickPreview` | Called when user clicks the `light` mode preview
`onReady` | Called when media is loaded and ready to play. If `playing` is set to `true`, media will play immediately
`onStart` | Called when media starts playing
`onPlay` | Called when media starts or resumes playing after pausing or buffering
`onProgress` | Called when media data is loaded
`onTimeUpdate` | Called when the media's current time changes
`onDuration` | Callback containing duration of the media, in seconds
`onPause` | Called when media is paused
`onSeeking` | Called when media is seeking
`onSeeked` | Called when media has finished seeking
`onRateChange` | Called when playback rate of the player changed<br />&nbsp; ◦ &nbsp;Only supported by YouTube, Vimeo ([if enabled](https://developer.vimeo.com/player/sdk/reference#playbackratechange)), Wistia, and file paths
`onEnded` | Called when media finishes playing<br />&nbsp; ◦ &nbsp;Does not fire when `loop` is set to `true`
`onError` | Called when an error occurs whilst attempting to play media
`onEnterPictureInPicture` | Called when entering picture-in-picture mode
`onLeavePictureInPicture` | Called when leaving picture-in-picture mode

### Methods

#### Static Methods

Method | Description
------ | -----------
`ReactPlayer.canPlay(url)` | Determine if a URL can be played. This does *not* detect media that is unplayable due to privacy settings, streaming permissions, etc. In that case, the `onError` prop will be invoked after attempting to play. Any URL that does not match any patterns will fall back to a native HTML5 media player.
`ReactPlayer.addCustomPlayer(CustomPlayer)` | Add a custom player. See [Adding custom players](#adding-custom-players)
`ReactPlayer.removeCustomPlayers()` | Remove any players that have been added using `addCustomPlayer()`

#### Instance Methods

Use [`ref`](https://react.dev/learn/manipulating-the-dom-with-refs) to call instance methods on the player. See [the demo app](examples/react/src/App.js) for an example of this. Since `v3`, the instance methods aim to be compatible 
with the [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) interface.

### Advanced Usage

#### Light player

The `light` prop will render a video thumbnail with simple play icon, and only load the full player once a user has interacted with the image. [Noembed](https://noembed.com) is used to fetch thumbnails for a video URL. Note that automatic thumbnail fetching for Facebook, Wistia, Mixcloud and file URLs are not supported, and ongoing support for other URLs is not guaranteed.

If you want to pass in your own thumbnail to use, set `light` to the image URL rather than `true`.

You can also pass a component through the `light` prop:

```jsx
<ReactPlayer light={<img src='https://example.com/thumbnail.png' alt='Thumbnail' />} />
```

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
  padding-top: 56.25%; /* Player ratio: 100 / (1280 / 720) */
}

.react-player {
  position: absolute;
  top: 0;
  left: 0;
}
```

See [`jsFiddle` example](https://jsfiddle.net/e6w3rtj1/)

#### SDK Overrides

You can use your own version of any player SDK, assuming the correct `window` global is set before the player mounts. For example, to use a local version of [`hls.js`](https://cdnjs.com/libraries/hls.js), add `<script src='/path/hls.js'></script>` to your app. If `window.Hls` is available when ReactPlayer mounts, it will use that instead of loading `hls.js` from `cdnjs`. See [#605](https://github.com/cookpete/react-player/issues/605#issuecomment-492561909) for more information.

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

#### Mobile considerations

Due to various restrictions, `ReactPlayer` is not guaranteed to function properly on mobile devices. The [YouTube player documentation](https://developers.google.com/youtube/iframe_api_reference), for example, explains that [certain mobile browsers require user interaction](https://developers.google.com/youtube/iframe_api_reference#Mobile_considerations) before playing:

> The HTML5 `<video>` element, in certain mobile browsers (such as Chrome and Safari), only allows playback to take place if it’s initiated by a user interaction (such as tapping on the player).

#### Multiple Sources and Tracks

Since `v3` if the player supports multiple sources and / or tracks, it works the same as the native 
`<source` and `<track>` elements in the HTML `<video>` or `<audio>` element. 

```jsx
<ReactPlayer controls>
  <source src="foo.webm" type="video/webm">
  <source src="foo.ogg" type="video/ogg">
  <track kind="subtitles" src="subs/subtitles.en.vtt" srclang="en" default>
  <track kind="subtitles" src="subs/subtitles.ja.vtt" srclang="ja">
  <track kind="subtitles" src="subs/subtitles.de.vtt" srclang="de">
</ReactPlayer>
```

### Migrating to `v2`

ReactPlayer `v2` changes single player imports and adds lazy loading players. Support for `preload` has also been removed, plus some other changes. See [`MIGRATING.md`](/MIGRATING.md) for information.

### Supported media

* [Supported file types](https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats) are playing using [`<video>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/video) or [`<audio>`](https://developer.mozilla.org/en/docs/Web/HTML/Element/audio) elements
* HLS streams are played using [`hls.js`](https://github.com/video-dev/hls.js)
* DASH streams are played using [`dash.js`](https://github.com/Dash-Industry-Forum/dash.js)
* Mux videos use the [`<mux-player>`](https://github.com/muxinc/elements/blob/main/packages/mux-player/README.md) element
* YouTube videos use the [YouTube iFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
* Vimeo videos use the [Vimeo Player API](https://developer.vimeo.com/player/sdk)
* Wistia videos use the [Wistia Player API](https://wistia.com/doc/player-api)

### Contributing

See the [contribution guidelines](https://github.com/cookpete/react-player/blob/master/CONTRIBUTING.md) before creating a pull request.

### Thanks

- Thanks to anyone who has [contributed](https://github.com/cookpete/react-player/graphs/contributors).
- Big thanks to my [Patreon](https://patreon.com/cookpete) supporters!

<table>
  <tr>
    <td align='center'>
      <a href='https://the100.tv'><img src='https://the100.tv/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fthe100-tv-alone-2k.2e7c7877.png&w=384&q=75' width='120' /><br />Jackson Doherty</a>
    </td>
    <td align='center'>
      <a href='https://github.com/jaxomlotus'><img src='https://avatars.githubusercontent.com/u/485706?s=120&v=4' /><br />Joseph Fung</a>
    </td>
  </tr>
</table>
