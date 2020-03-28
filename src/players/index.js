import { lazy } from 'react'
import { isMediaStream } from '../utils'

import {
  MATCH_URL_YOUTUBE,
  MATCH_URL_SOUNDCLOUD,
  MATCH_URL_VIMEO,
  MATCH_URL_VIMEO_FILE,
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
    canPlay: url => MATCH_URL_YOUTUBE.test(url),
    Player: lazy(() => import('./YouTube')),
    configKey: 'youtube',
    preloadUrl: 'https://www.youtube.com/watch?v=GlCmAC4MHek'
  },
  {
    canPlay: url => MATCH_URL_SOUNDCLOUD.test(url),
    Player: lazy(() => import('./SoundCloud')),
    configKey: 'soundcloud',
    preloadUrl: 'https://soundcloud.com/seucheu/john-cage-433-8-bit-version'
  },
  {
    canPlay: url => {
      if (MATCH_URL_VIMEO_FILE.test(url)) {
        return false
      }
      return MATCH_URL_VIMEO.test(url)
    },
    Player: lazy(() => import('./Vimeo')),
    configKey: 'vimeo',
    preloadUrl: 'https://vimeo.com/300970506'
  },
  {
    canPlay: url => MATCH_URL_FACEBOOK.test(url),
    Player: lazy(() => import('./Facebook'))
  },
  {
    canPlay: url => MATCH_URL_STREAMABLE.test(url),
    Player: lazy(() => import('./Streamable'))
  },
  {
    canPlay: url => MATCH_URL_WISTIA.test(url),
    Player: lazy(() => import('./Wistia'))
  },
  {
    canPlay: url => MATCH_URL_TWITCH_VIDEO.test(url) || MATCH_URL_TWITCH_CHANNEL.test(url),
    Player: lazy(() => import('./Twitch'))
  },
  {
    canPlay: url => MATCH_URL_DAILYMOTION.test(url),
    Player: lazy(() => import('./DailyMotion')),
    configKey: 'dailymotion',
    preloadUrl: 'http://www.dailymotion.com/video/xqdpyk'
  },
  {
    canPlay: url => MATCH_URL_MIXCLOUD.test(url),
    Player: lazy(() => import('./Mixcloud'))
  },
  {
    canPlay: url => MATCH_URL_VIDYARD.test(url),
    Player: lazy(() => import('./Vidyard'))
  },
  {
    canPlay: canPlayFile,
    Player: lazy(() => import('./FilePlayer'))
  }
]
