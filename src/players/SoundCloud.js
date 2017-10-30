import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'

const SDK_URL = 'https://connect.soundcloud.com/sdk/sdk-3.0.0.js'
const SDK_GLOBAL = 'SC'
const MATCH_URL = /^https?:\/\/(soundcloud.com|snd.sc)\/([a-z0-9-_]+\/[a-z0-9-_]+)$/

const ERRORS = ['geo_blocked', 'no_streams', 'no_connection', 'no_protocol', 'audio_error']

export default class SoundCloud extends Component {
  static displayName = 'SoundCloud'
  static canPlay = url => MATCH_URL.test(url)
  static loopOnEnded = true

  track = null

  callPlayer = callPlayer
  duration = null
  currentTime = null
  fractionLoaded = null

  constructor (props, context) {
    super(props, context)

    this.state = {
      track: null
    }
  }

  pSetState (stateModifications) {
    return new Promise((resolve, reject) => {
      this.setState(stateModifications, resolve)
    })
  }

  load (url, isReady) {
    getSDK(SDK_URL, SDK_GLOBAL).then(SC => {
      if (!isReady) {
        SC.initialize({ client_id: this.props.config.soundcloud.clientId })
        SC.get('/resolve', { url: this.props.url })
          .then((track) => {
            return this.pSetState({ track })
                       .then(() => track)
          })
          .then((track) => {
            this.duration = track.duration / 1000
            return SC.stream('/tracks/' + track.id, { autoPlay: true })
          })
          .then((player) => {
            this.player = player

            this.player.on('play', this.props.onPlay)
            this.player.on('pause', this.props.onPause)
            this.player.on('time', () => {
              this.currentTime = this.player.controller._currentPosition / 1000
              this.fractionLoaded = this.player.controller._loadedPosition
            })
            this.player.on('finish', () => this.props.onEnded())

            ERRORS.forEach((error) => {
              this.player.on(error, (e) => this.props.onError(e))
            })

            this.props.onReady()
          })
          .catch(this.props.onError)
      }
    })
  }
  play () {
    this.callPlayer('play')
  }
  pause () {
    this.callPlayer('pause')
  }
  stop () {
    this.player.pause()
  }
  seekTo (seconds) {
    this.callPlayer('seek', seconds * 1000)
  }
  setVolume (fraction) {
    this.callPlayer('setVolume', fraction)
  }
  getDuration () {
    return this.duration
  }
  getCurrentTime () {
    return this.currentTime
  }
  getSecondsLoaded () {
    return this.fractionLoaded * this.duration
  }
  render () {
    const style = {
      width: '100%',
      height: '100%'
    }

    const artwork = this.state.track ? this.state.track.artwork_url : ''

    return (
      <img src={artwork} style={style} />
    )
  }
}
