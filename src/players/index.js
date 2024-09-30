import { lazy, supportsWebKitPresentationMode } from '../utils.js'
import { canPlay, AUDIO_EXTENSIONS } from '../patterns.js'

export default [
  {
    key: 'youtube',
    name: 'YouTube',
    canPlay: canPlay.youtube,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerYouTube' */'./YouTube.js'))
  },
  {
    key: 'soundcloud',
    name: 'SoundCloud',
    canPlay: canPlay.soundcloud,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerSoundCloud' */'./SoundCloud.js'))
  },
  {
    key: 'vimeo',
    name: 'Vimeo',
    canPlay: canPlay.vimeo,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerVimeo' */'./Vimeo.js'))
  },
  {
    key: 'mux',
    name: 'Mux',
    canPlay: canPlay.mux,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerMux' */'./Mux.js'))
  },
  {
    key: 'facebook',
    name: 'Facebook',
    canPlay: canPlay.facebook,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerFacebook' */'./Facebook.js'))
  },
  {
    key: 'streamable',
    name: 'Streamable',
    canPlay: canPlay.streamable,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerStreamable' */'./Streamable.js'))
  },
  {
    key: 'wistia',
    name: 'Wistia',
    canPlay: canPlay.wistia,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerWistia' */'./Wistia.js'))
  },
  {
    key: 'twitch',
    name: 'Twitch',
    canPlay: canPlay.twitch,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerTwitch' */'./Twitch.js'))
  },
  {
    key: 'dailymotion',
    name: 'DailyMotion',
    canPlay: canPlay.dailymotion,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerDailyMotion' */'./DailyMotion.js'))
  },
  {
    key: 'mixcloud',
    name: 'Mixcloud',
    canPlay: canPlay.mixcloud,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerMixcloud' */'./Mixcloud.js'))
  },
  {
    key: 'vidyard',
    name: 'Vidyard',
    canPlay: canPlay.vidyard,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerVidyard' */'./Vidyard.js'))
  },
  {
    key: 'kaltura',
    name: 'Kaltura',
    canPlay: canPlay.kaltura,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerKaltura' */'./Kaltura.js'))
  },
  {
    key: 'file',
    name: 'FilePlayer',
    canPlay: canPlay.file,
    canEnablePIP: url => {
      return canPlay.file(url) && (document.pictureInPictureEnabled || supportsWebKitPresentationMode()) && !AUDIO_EXTENSIONS.test(url)
    },
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerFilePlayer' */'./FilePlayer.js'))
  }
]
