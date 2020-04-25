import { lazy } from 'react'
import { isMediaStream, supportsWebKitPresentationMode } from '../utils'

import {
  MATCH_URL_YOUTUBE,
  MATCH_URL_SOUNDCLOUD,
  MATCH_URL_VIMEO,
  MATCH_URL_FACEBOOK,
  MATCH_URL_STREAMABLE,
  MATCH_URL_WISTIA,
  MATCH_URL_TWITCH_VIDEO,
  MATCH_URL_TWITCH_CHANNEL,
  MATCH_URL_DAILYMOTION,
  MATCH_URL_MIXCLOUD,
  MATCH_URL_VIDYARD,
  AUDIO_EXTENSIONS,
  VIDEO_EXTENSIONS,
  HLS_EXTENSIONS,
  DASH_EXTENSIONS
} from '../patterns'

const canPlayFile = url => {
  if (url instanceof Array) {
    for (const item of url) {
      if (typeof item === 'string' && canPlayFile(item)) {
        return true
      }
      if (canPlayFile(item.src)) {
        return true
      }
    }
    return false
  }
  if (isMediaStream(url)) {
    return true
  }
  return (
    AUDIO_EXTENSIONS.test(url) ||
    VIDEO_EXTENSIONS.test(url) ||
    HLS_EXTENSIONS.test(url) ||
    DASH_EXTENSIONS.test(url)
  )
}

export default [
  {
    key: 'youtube',
    canPlay: url => MATCH_URL_YOUTUBE.test(url),
    lazyPlayer: lazy(() => import('./YouTube'))
  },
  {
    key: 'soundcloud',
    canPlay: url => MATCH_URL_SOUNDCLOUD.test(url) && !AUDIO_EXTENSIONS.test(url),
    lazyPlayer: lazy(() => import('./SoundCloud'))
  },
  {
    key: 'vimeo',
    canPlay: url => MATCH_URL_VIMEO.test(url) && !VIDEO_EXTENSIONS.test(url) && !HLS_EXTENSIONS.test(url),
    lazyPlayer: lazy(() => import('./Vimeo'))
  },
  {
    key: 'facebook',
    canPlay: url => MATCH_URL_FACEBOOK.test(url),
    lazyPlayer: lazy(() => import('./Facebook'))
  },
  {
    key: 'streamable',
    canPlay: url => MATCH_URL_STREAMABLE.test(url),
    lazyPlayer: lazy(() => import('./Streamable'))
  },
  {
    key: 'wistia',
    canPlay: url => MATCH_URL_WISTIA.test(url),
    lazyPlayer: lazy(() => import('./Wistia'))
  },
  {
    key: 'twitch',
    canPlay: url => MATCH_URL_TWITCH_VIDEO.test(url) || MATCH_URL_TWITCH_CHANNEL.test(url),
    lazyPlayer: lazy(() => import('./Twitch'))
  },
  {
    key: 'dailymotion',
    canPlay: url => MATCH_URL_DAILYMOTION.test(url),
    lazyPlayer: lazy(() => import('./DailyMotion'))
  },
  {
    key: 'mixcloud',
    canPlay: url => MATCH_URL_MIXCLOUD.test(url),
    lazyPlayer: lazy(() => import('./Mixcloud'))
  },
  {
    key: 'vidyard',
    canPlay: url => MATCH_URL_VIDYARD.test(url),
    lazyPlayer: lazy(() => import('./Vidyard'))
  },
  {
    key: 'file',
    canPlay: canPlayFile,
    canEnablePIP: url => {
      return canPlayFile(url) && (document.pictureInPictureEnabled || supportsWebKitPresentationMode()) && !AUDIO_EXTENSIONS.test(url)
    },
    lazyPlayer: lazy(() => import('./FilePlayer'))
  }
]
