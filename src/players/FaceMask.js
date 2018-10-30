import React, { Component } from 'react'

import { callPlayer, getSDK, randomString } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = 'https://www.nfl.com/libs/playaction/api.js'
const SDK_GLOBAL = 'nfl'
const MATCH_FILE_URL = /nflent-vh\.akamaihd\.net\/.+\.m3u8/
const PLAYER_ID_PREFIX = 'facemask-player-'

export class FaceMask extends Component {
  static displayName = 'FaceMask'
  static canPlay = url => MATCH_FILE_URL.test(url)
  callPlayer = callPlayer
  duration = null
  volume = null
  currentTime = null
  secondsLoaded = null
  playerID = PLAYER_ID_PREFIX + randomString()
  load (url) {
    this.duration = null
    getSDK(SDK_URL, SDK_GLOBAL).then(nfl => {
      if (!this.container) return
      // eslint-disable-next-line new-cap
      this.player = new nfl.playaction({
        containerId: this.playerID,
        initialVideo: { url },
        height: '100%',
        width: '100%'
      })
      const { PLAYER_READY, STATUS, TIME_UPDATE, VOLUME } = nfl.playaction.EVENTS
      const { COMPLETE, ERROR, PAUSED, PLAYING } = nfl.playaction.STATUS
      this.player.on(PLAYER_READY, this.props.onReady)
      this.player.on(VOLUME, this.props.onVolumeChange)
      this.player.on(STATUS, (e) => {
        switch (e.status) {
          case COMPLETE: {
            this.props.onEnded()
            break
          }
          case ERROR: {
            this.props.onError(e)
            break
          }
          case PAUSED: {
            this.props.onPause()
            break
          }
          case PLAYING: {
            this.props.onPlay()
            break
          }
        }
      })
      this.player.on(TIME_UPDATE, ({currentTime, duration}) => {
        this.currentTime = currentTime
        this.duration = duration || Infinity
      })
    }, this.props.onError)
  }
  play () {
    this.callPlayer('play')
  }
  pause () {
    this.callPlayer('pause')
  }
  stop () {
    this.callPlayer('destroy')
  }
  seekTo (seconds) {
    this.callPlayer('seek', seconds)
  }
  setVolume (fraction) {
    // not supported
  }
  mute () {
    this.callPlayer('mute')
  }
  unmute () {
    this.callPlayer('unmute')
  }
  getDuration () {
    return this.duration
  }
  getCurrentTime () {
    return this.currentTime
  }
  getSecondsLoaded () {
    return this.secondsLoaded
  }
  ref = (container) => {
    this.container = container
  }
  render () {
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
      <div
        id={this.playerID}
        ref={this.ref}
        style={style}
      />
    )
  }
}

export default createSinglePlayer(FaceMask)
