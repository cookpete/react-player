import { lazy } from 'react'
import { supportsWebKitPresentationMode } from '../utils'
import { canPlay, AUDIO_EXTENSIONS } from '../patterns'

export default [
  {
    key: 'youtube',
    canPlay: canPlay.youtube,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerYouTube' */'./YouTube'))
  },
  {
    key: 'soundcloud',
    canPlay: canPlay.soundcloud,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerSoundCloud' */'./SoundCloud'))
  },
  {
    key: 'vimeo',
    canPlay: canPlay.vimeo,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerVimeo' */'./Vimeo'))
  },
  {
    key: 'facebook',
    canPlay: canPlay.facebook,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerFacebook' */'./Facebook'))
  },
  {
    key: 'streamable',
    canPlay: canPlay.streamable,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerStreamable' */'./Streamable'))
  },
  {
    key: 'wistia',
    canPlay: canPlay.wistia,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerWistia' */'./Wistia'))
  },
  {
    key: 'twitch',
    canPlay: canPlay.twitch,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerTwitch' */'./Twitch'))
  },
  {
    key: 'dailymotion',
    canPlay: canPlay.dailymotion,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerDailyMotion' */'./DailyMotion'))
  },
  {
    key: 'mixcloud',
    canPlay: canPlay.mixcloud,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerMixcloud' */'./Mixcloud'))
  },
  {
    key: 'vidyard',
    canPlay: canPlay.vidyard,
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerVidyard' */'./Vidyard'))
  },
  {
    key: 'file',
    canPlay: canPlay.file,
    canEnablePIP: url => {
      return canPlay.file(url) && (document.pictureInPictureEnabled || supportsWebKitPresentationMode()) && !AUDIO_EXTENSIONS.test(url)
    },
    lazyPlayer: lazy(() => import(/* webpackChunkName: 'reactPlayerFilePlayer' */'./FilePlayer'))
  }
]
