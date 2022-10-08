import { isMediaStream, isBlobUrl } from './utils'

export const MATCH_URL_YOUTUBE = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//
export const MATCH_URL_SOUNDCLOUD = /(?:soundcloud\.com|snd\.sc)\/[^.]+$/
export const MATCH_URL_VIMEO = /vimeo\.com\/(?!progressive_redirect).+/
export const MATCH_URL_FACEBOOK = /^https?:\/\/(www\.)?facebook\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/
export const MATCH_URL_FACEBOOK_WATCH = /^https?:\/\/fb\.watch\/.+$/
export const MATCH_URL_STREAMABLE = /streamable\.com\/([a-z0-9]+)$/
export const MATCH_URL_WISTIA = /(?:wistia\.(?:com|net)|wi\.st)\/(?:medias|embed)\/(?:iframe\/)?(.*)$/
export const MATCH_URL_TWITCH_VIDEO = /(?:www\.|go\.)?twitch\.tv\/videos\/(\d+)($|\?)/
export const MATCH_URL_TWITCH_CHANNEL = /(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+)($|\?)/
export const MATCH_URL_DAILYMOTION = /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?(?:[\w.#_-]+)?/
export const MATCH_URL_MIXCLOUD = /mixcloud\.com\/([^/]+\/[^/]+)/
export const MATCH_URL_VIDYARD = /vidyard.com\/(?:watch\/)?([a-zA-Z0-9-_]+)/
export const MATCH_URL_KALTURA = /^https?:\/\/[a-zA-Z]+\.kaltura.(com|org)\/p\/([0-9]+)\/sp\/([0-9]+)00\/embedIframeJs\/uiconf_id\/([0-9]+)\/partner_id\/([0-9]+)(.*)entry_id.([a-zA-Z0-9-_].*)$/
export const AUDIO_EXTENSIONS = /\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i
export const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i
export const HLS_EXTENSIONS = /\.(m3u8)($|\?)/i
export const DASH_EXTENSIONS = /\.(mpd)($|\?)/i
export const FLV_EXTENSIONS = /\.(flv)($|\?)/i

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
  if (isMediaStream(url) || isBlobUrl(url)) {
    return true
  }
  return (
    AUDIO_EXTENSIONS.test(url) ||
    VIDEO_EXTENSIONS.test(url) ||
    HLS_EXTENSIONS.test(url) ||
    DASH_EXTENSIONS.test(url) ||
    FLV_EXTENSIONS.test(url)
  )
}

export const canPlay = {
  youtube: url => {
    if (url instanceof Array) {
      return url.every(item => MATCH_URL_YOUTUBE.test(item))
    }
    return MATCH_URL_YOUTUBE.test(url)
  },
  soundcloud: url => MATCH_URL_SOUNDCLOUD.test(url) && !AUDIO_EXTENSIONS.test(url),
  vimeo: url => MATCH_URL_VIMEO.test(url) && !VIDEO_EXTENSIONS.test(url) && !HLS_EXTENSIONS.test(url),
  facebook: url => MATCH_URL_FACEBOOK.test(url) || MATCH_URL_FACEBOOK_WATCH.test(url),
  streamable: url => MATCH_URL_STREAMABLE.test(url),
  wistia: url => MATCH_URL_WISTIA.test(url),
  twitch: url => MATCH_URL_TWITCH_VIDEO.test(url) || MATCH_URL_TWITCH_CHANNEL.test(url),
  dailymotion: url => MATCH_URL_DAILYMOTION.test(url),
  mixcloud: url => MATCH_URL_MIXCLOUD.test(url),
  vidyard: url => MATCH_URL_VIDYARD.test(url),
  kaltura: url => MATCH_URL_KALTURA.test(url),
  file: canPlayFile
}
