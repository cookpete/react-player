import React, { Component } from 'react'

import { callPlayer, getSDK, randomString } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = '//cdn.jwplayer.com/libraries/8DNY8ff0.js'
const SDK_GLOBAL = 'jwplayer'
// TODO: figure out all cases
const MATCH_VIDEO_URL = /jwplayer/;
const PLAYER_ID_PREFIX = 'jw-player-'

export class JWPlayer extends Component {
  static displayName = 'JWPlayer'
  static canPlay = url => MATCH_VIDEO_URL.test(url);
  static loopOnEnded = true

  callPlayer = callPlayer
  playerID = PLAYER_ID_PREFIX + randomString()
  load (url, isReady) {
    const { playsinline, onError, config } = this.props
    if (isReady) {
      this.player.setup({
        file: url,
      })
    } else {
      getSDK(SDK_URL, SDK_GLOBAL).then(jwplayer => {
        this.player = jwplayer(this.playerID).setup({
          file: url,
        });
        this.player.on("ready", this.props.onReady);
        this.player.on("play", this.props.onPlay);
        this.player.on("pause", this.props.onPause);
        this.player.on("error", onError);
      }, onError)
    }
  }
  handleUnmount() {
    this.callPlayer('remove');
  }
  play () {
    this.callPlayer('play')
  }
  pause () {
    this.callPlayer('pause')
  }
  stop () {
    this.callPlayer('stop')
  }
  seekTo (seconds) {
    this.callPlayer('seek', seconds)
  }
  getVolume () {
    return this.callPlayer('getVolume') / 100;
  }
  getMuted () {
    return this.callPlayer('getMute')
  }
  setVolume (fraction) {
    this.callPlayer('setVolume', fraction * 100)
  }
  mute = () => {
    this.callPlayer('setMute', true)
  }
  unmute = () => {
    this.callPlayer('setMute', false)
  }
  getDuration () {
    return this.callPlayer('getDuration')
  }
  getCurrentTime () {
    return this.callPlayer('getCurrentPosition')
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

export default createSinglePlayer(JWPlayer)
