import React, { Component } from 'react'

import { callPlayer, getSDK, parseStartTime, randomString } from '../utils'
import { canPlay, MATCH_URL_TWITCH_CHANNEL, MATCH_URL_TWITCH_VIDEO } from '../patterns'

const SDK_URL = 'https://player.twitch.tv/js/embed/v1.js'
const SDK_GLOBAL = 'Twitch'
const PLAYER_ID_PREFIX = 'twitch-player-'

export default class Twitch extends Component {
  static displayName = 'Twitch'
  static canPlay = canPlay.twitch
  static loopOnEnded = true
  callPlayer = callPlayer
  playerID = this.props.config.playerId || `${PLAYER_ID_PREFIX}${randomString()}`

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  load (url, isReady) {
    const { playsinline, onError, config, controls } = this.props
    const isChannel = MATCH_URL_TWITCH_CHANNEL.test(url)
    const id = isChannel ? url.match(MATCH_URL_TWITCH_CHANNEL)[1] : url.match(MATCH_URL_TWITCH_VIDEO)[1]
    if (isReady) {
      if (isChannel) {
        this.player.setChannel(id)
      } else {
        this.player.setVideo('v' + id)
      }
      return
    }
    getSDK(SDK_URL, SDK_GLOBAL).then(Twitch => {
      this.player = new Twitch.Player(this.playerID, {
        video: isChannel ? '' : id,
        channel: isChannel ? id : '',
        height: '100%',
        width: '100%',
        playsinline: playsinline,
        autoplay: this.props.playing,
        muted: this.props.muted,
        // https://github.com/CookPete/react-player/issues/733#issuecomment-549085859
        controls: isChannel ? true : controls,
        time: parseStartTime(url),
        ...config.options
      })
      const { READY, PLAYING, PAUSE, ENDED, ONLINE, OFFLINE, SEEK } = Twitch.Player
      this.player.addEventListener(READY, this.props.onReady)
      this.player.addEventListener(PLAYING, this.props.onPlay)
      this.player.addEventListener(PAUSE, this.props.onPause)
      this.player.addEventListener(ENDED, this.props.onEnded)
      this.player.addEventListener(SEEK, this.props.onSeek)

      // Prevent weird isLoading behaviour when streams are offline
      this.player.addEventListener(ONLINE, this.props.onLoaded)
      this.player.addEventListener(OFFLINE, this.props.onLoaded)
    }, onError)
  }

  play () {
    this.callPlayer('play')
  }

  pause () {
    this.callPlayer('pause')
  }

  stop () {
    this.callPlayer('pause')
  }

  seekTo (seconds, keepPlaying = true) {
    this.callPlayer('seek', seconds)
    if (!keepPlaying) {
      this.pause()
    }
  }

  setVolume (fraction) {
    this.callPlayer('setVolume', fraction)
  }

  mute = () => {
    this.callPlayer('setMuted', true)
  }

  unmute = () => {
    this.callPlayer('setMuted', false)
  }

  getDuration () {
    return this.callPlayer('getDuration')
  }

  getCurrentTime () {
    return this.callPlayer('getCurrentTime')
  }

  getSecondsLoaded () {
    return null
  }

  render () {
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
      <div style={style} id={this.playerID} />
    )
  }
}
