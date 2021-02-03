import { lazy } from 'react'
import { supportsWebKitPresentationMode } from '../utils'
import { canPlay, AUDIO_EXTENSIONS } from '../patterns'

export default [
  {
    key: 'youtube',
    name: 'YouTube',
    canPlay: canPlay.youtube,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerYouTube' */'./YouTube'))
  },
  {
    key: 'soundcloud',
    name: 'SoundCloud',
    canPlay: canPlay.soundcloud,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerSoundCloud' */'./SoundCloud'))
  },
  {
    key: 'vimeo',
    name: 'Vimeo',
    canPlay: canPlay.vimeo,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerVimeo' */'./Vimeo'))
  },
  {
    key: 'facebook',
    name: 'Facebook',
    canPlay: canPlay.facebook,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerFacebook' */'./Facebook'))
  },
  {
    key: 'streamable',
    name: 'Streamable',
    canPlay: canPlay.streamable,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerStreamable' */'./Streamable'))
  },
  {
    key: 'wistia',
    name: 'Wistia',
    canPlay: canPlay.wistia,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerWistia' */'./Wistia'))
  },
  {
    key: 'twitch',
    name: 'Twitch',
    canPlay: canPlay.twitch,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerTwitch' */'./Twitch'))
  },
  {
    key: 'dailymotion',
    name: 'DailyMotion',
    canPlay: canPlay.dailymotion,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerDailyMotion' */'./DailyMotion'))
  },
  {
    key: 'mixcloud',
    name: 'Mixcloud',
    canPlay: canPlay.mixcloud,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerMixcloud' */'./Mixcloud'))
  },
  {
    key: 'vidyard',
    name: 'Vidyard',
    canPlay: canPlay.vidyard,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerVidyard' */'./Vidyard'))
  },
  {
    key: 'kaltura',
    name: 'Kaltura',
    canPlay: canPlay.kaltura,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerKaltura' */'./Kaltura'))
  },
  {
    key: 'file',
    name: 'FilePlayer',
    canPlay: canPlay.file,
    canEnablePIP: url => {
      return canPlay.file(url) && (document.pictureInPictureEnabled || supportsWebKitPresentationMode()) && !AUDIO_EXTENSIONS.test(url)
    },
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerFilePlayer' */'./FilePlayer'))
  }
]
