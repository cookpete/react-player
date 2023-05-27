import React, { Component } from 'react'

import { callPlayer, getSDK, randomString } from '../utils'
import { canPlay } from '../patterns'

const SDK_URL = 'https://connect.facebook.net/en_US/sdk.js'
const SDK_GLOBAL = 'FB'
const SDK_GLOBAL_READY = 'fbAsyncInit'
const PLAYER_ID_PREFIX = 'facebook-player-'

export default class Facebook extends Component {
  static displayName = 'Facebook'
  static canPlay = canPlay.facebook
  static loopOnEnded = true
  callPlayer = callPlayer
  playerID = this.props.config.playerId || `${PLAYER_ID_PREFIX}${randomString()}`

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  load (url, isReady) {
    if (isReady) {
      getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY).then(FB => FB.XFBML.parse())
      return
    }
    getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY).then(FB => {
      FB.init({
        appId: this.props.config.appId,
        xfbml: true,
        version: this.props.config.version
      })
      FB.Event.subscribe('xfbml.render', msg => {
        // Here we know the SDK has loaded, even if onReady/onPlay
        // is not called due to a video that cannot be embedded
        this.props.onLoaded()
      })
      FB.Event.subscribe('xfbml.ready', msg => {
        if (msg.type === 'video' && msg.id === this.playerID) {
          this.player = msg.instance
          this.player.subscribe('startedPlaying', this.props.onPlay)
          this.player.subscribe('paused', this.props.onPause)
          this.player.subscribe('finishedPlaying', this.props.onEnded)
          this.player.subscribe('startedBuffering', this.props.onBuffer)
          this.player.subscribe('finishedBuffering', this.props.onBufferEnd)
          this.player.subscribe('error', this.props.onError)
          if (this.props.muted) {
            this.callPlayer('mute')
          } else {
            this.callPlayer('unmute')
          }
          this.props.onReady()

          // For some reason Facebook have added `visibility: hidden`
          // to the iframe when autoplay fails, so here we set it back
          document.getElementById(this.playerID).querySelector('iframe').style.visibility = 'visible'
        }
      })
    })
  }

  play () {
    this.callPlayer('play')
  }

  pause () {
    this.callPlayer('pause')
  }

  stop () {
    // Nothing to do
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
    this.callPlayer('mute')
  }

  unmute = () => {
    this.callPlayer('unmute')
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
    const { attributes } = this.props.config
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
      <div
        style={style}
        id={this.playerID}
        className='fb-video'
        data-href={this.props.url}
        data-autoplay={this.props.playing ? 'true' : 'false'}
        data-allowfullscreen='true'
        data-controls={this.props.controls ? 'true' : 'false'}
        {...attributes}
      />
    )
  }
}
