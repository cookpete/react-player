import { PropTypes } from 'react'

export const propTypes = {
  url: PropTypes.string,
  playing: PropTypes.bool,
  loop: PropTypes.bool,
  controls: PropTypes.bool,
  volume: PropTypes.number,
  width: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  height: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  className: PropTypes.string,
  progressFrequency: PropTypes.number,
  config: PropTypes.shape({
    soundcloud: PropTypes.shape({
      clientId: PropTypes.string
    }),
    youtube: PropTypes.shape({
      params: PropTypes.object,
      preload: PropTypes.bool
    }),
    vimeo: PropTypes.shape({
      params: PropTypes.object,
      preload: PropTypes.bool
    }),
    file: PropTypes.shape({
      attributes: PropTypes.object
    })
  }),
  onStart: PropTypes.func,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onBuffer: PropTypes.func,
  onEnded: PropTypes.func,
  onError: PropTypes.func,
  onDuration: PropTypes.func,
  onProgress: PropTypes.func
}

export const defaultProps = {
  playing: false,
  loop: false,
  controls: false,
  volume: 0.8,
  width: 640,
  height: 360,
  progressFrequency: 1000,
  config: defaultConfig,
  onStart: function () {},
  onPlay: function () {},
  onPause: function () {},
  onBuffer: function () {},
  onEnded: function () {},
  onError: function () {},
  onDuration: function () {},
  onProgress: function () {}
}

export const defaultConfig = {
  soundcloud: {
    clientId: 'e8b6f84fbcad14c301ca1355cae1dea2',
    attributes: {
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#Attributes
    }
  },
  youtube: {
    preload: false,
    params: {
      // https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
      autoplay: 0,
      playsinline: 1,
      showinfo: 0,
      rel: 0,
      iv_load_policy: 3
    }
  },
  vimeo: {
    preload: false,
    params: {
      // https://developer.vimeo.com/player/embedding#universal-parameters
      api: 1,
      autoplay: 0,
      badge: 0,
      byline: 0,
      fullscreen: 1,
      portrait: 0,
      title: 0
    }
  },
  file: {
    attributes: {
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#Attributes
    }
  }
}
