import PropTypes from 'prop-types'

const { string, bool, number, array, oneOfType, shape, object, func } = PropTypes

export const propTypes = {
  url: oneOfType([ string, array, object ]),
  playing: bool,
  loop: bool,
  controls: bool,
  volume: number,
  muted: bool,
  playbackRate: number,
  width: oneOfType([ string, number ]),
  height: oneOfType([ string, number ]),
  style: object,
  progressInterval: number,
  playsinline: bool,
  pip: bool,
  light: oneOfType([ bool, string ]),
  wrapper: oneOfType([
    string,
    func,
    shape({ render: func.isRequired })
  ]),
  config: shape({
    soundcloud: shape({
      options: object,
      preload: bool
    }),
    youtube: shape({
      playerVars: object,
      embedOptions: object,
      preload: bool
    }),
    facebook: shape({
      appId: string
    }),
    dailymotion: shape({
      params: object,
      preload: bool
    }),
    vimeo: shape({
      playerOptions: object,
      preload: bool
    }),
    file: shape({
      attributes: object,
      tracks: array,
      forceVideo: bool,
      forceAudio: bool,
      forceHLS: bool,
      forceDASH: bool,
      hlsOptions: object,
      hlsVersion: string,
      dashVersion: string
    }),
    wistia: shape({
      options: object
    }),
    mixcloud: shape({
      options: object
    }),
    twitch: shape({
      options: object
    })
  }),
  onReady: func,
  onStart: func,
  onPlay: func,
  onPause: func,
  onBuffer: func,
  onBufferEnd: func,
  onEnded: func,
  onError: func,
  onDuration: func,
  onSeek: func,
  onProgress: func,
  onEnablePIP: func,
  onDisablePIP: func
}

export const defaultProps = {
  playing: false,
  loop: false,
  controls: false,
  volume: null,
  muted: false,
  playbackRate: 1,
  width: '640px',
  height: '360px',
  style: {},
  progressInterval: 1000,
  playsinline: false,
  pip: false,
  light: false,
  wrapper: 'div',
  config: {
    soundcloud: {
      options: {
        visual: true, // Undocumented, but makes player fill container and look better
        buying: false,
        liking: false,
        download: false,
        sharing: false,
        show_comments: false,
        show_playcount: false
      }
    },
    youtube: {
      playerVars: {
        playsinline: 1,
        showinfo: 0,
        rel: 0,
        iv_load_policy: 3,
        modestbranding: 1
      },
      embedOptions: {},
      preload: false
    },
    facebook: {
      appId: '1309697205772819'
    },
    dailymotion: {
      params: {
        api: 1,
        'endscreen-enable': false
      },
      preload: false
    },
    vimeo: {
      playerOptions: {
        autopause: false,
        byline: false,
        portrait: false,
        title: false
      },
      preload: false
    },
    file: {
      attributes: {},
      tracks: [],
      forceVideo: false,
      forceAudio: false,
      forceHLS: false,
      forceDASH: false,
      hlsOptions: {},
      hlsVersion: '0.10.1',
      dashVersion: '2.9.2'
    },
    wistia: {
      options: {}
    },
    mixcloud: {
      options: {
        hide_cover: 1
      }
    },
    twitch: {
      options: {}
    }
  },
  onReady: function () {},
  onStart: function () {},
  onPlay: function () {},
  onPause: function () {},
  onBuffer: function () {},
  onBufferEnd: function () {},
  onEnded: function () {},
  onError: function () {},
  onDuration: function () {},
  onSeek: function () {},
  onProgress: function () {},
  onEnablePIP: function () {},
  onDisablePIP: function () {}
}

export const DEPRECATED_CONFIG_PROPS = [
  'soundcloudConfig',
  'youtubeConfig',
  'facebookConfig',
  'dailymotionConfig',
  'vimeoConfig',
  'fileConfig',
  'wistiaConfig'
]
