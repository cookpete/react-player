import React from 'react'

import createPlayer from '../createPlayer'
import { getSDK, parseStartTime } from '../utils'

const SDK_URL = 'https://www.youtube.com/iframe_api'
const SDK_GLOBAL = 'YT'
const SDK_GLOBAL_READY = 'onYouTubeIframeAPIReady'
const MATCH_URL = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
const BLANK_VIDEO_URL = 'https://www.youtube.com/watch?v=GlCmAC4MHek'

export default createPlayer({
  displayName: 'YouTube',
  matchURL: MATCH_URL,
  shouldPreload: props => props.config.youtube.preload,
  preloadURL: BLANK_VIDEO_URL,
  loopOnEnded: true,
  load: (url, callbacks, props, element, isReady, player) => new Promise(resolve => {
    const { onReady, onPlay, onPause, onBuffer, onEnded, onError } = callbacks
    const { playsinline, controls, config } = props
    const id = url && url.match(MATCH_URL)[1]
    if (isReady) {
      player.cueVideoById({
        videoId: id,
        startSeconds: parseStartTime(url)
      })
      return
    }
    const onStateChange = ({ data }) => {
      const { PLAYING, PAUSED, BUFFERING, ENDED, CUED } = window[SDK_GLOBAL].PlayerState
      if (data === PLAYING) onPlay()
      if (data === PAUSED) onPause()
      if (data === BUFFERING) onBuffer()
      if (data === ENDED) onEnded()
      if (data === CUED) onReady()
    }
    getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY, YT => YT.loaded).then(YT => {
      const player = new YT.Player(element, {
        width: '100%',
        height: '100%',
        videoId: id,
        playerVars: {
          controls: controls ? 1 : 0,
          start: parseStartTime(url),
          origin: window.location.origin,
          playsinline: playsinline,
          ...config.youtube.playerVars
        },
        events: {
          onReady: onReady,
          onStateChange: onStateChange,
          onError: event => onError(event.data)
        }
      })
      resolve(player)
    }, onError)
  }),
  play: 'playVideo',
  pause: 'pauseVideo',
  stop: player => {
    if (!document.body.contains(player.getIframe())) return
    player.stopVideo()
  },
  seekTo: 'seekTo',
  setVolume: (player, fraction) => player.setVolume(fraction * 100),
  setPlaybackRate: 'setPlaybackRate',
  getDuration: 'getDuration',
  getCurrentTime: 'getCurrentTime',
  getSecondsLoaded: player => player.getVideoLoadedFraction() * player.getDuration(),
  render: (props, ref) => {
    const style = {
      width: '100%',
      height: '100%',
      display: props.url ? 'block' : 'none'
    }
    return (
      <div style={style}>
        <div ref={ref} />
      </div>
    )
  }
})
