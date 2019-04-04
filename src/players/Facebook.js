import React, { Component } from 'react'

import { callPlayer, getSDK, randomString } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = '//connect.facebook.net/en_US/sdk.js'
const SDK_GLOBAL = 'FB'
const SDK_GLOBAL_READY = 'fbAsyncInit'
const MATCH_URL = /facebook\.com\/([^/?].+\/)?video(s|\.php)[/?].*$/
const PLAYER_ID_PREFIX = 'facebook-player-'

export class Facebook extends Component {
  static displayName = 'Facebook'
  static canPlay = url => MATCH_URL.test(url)
  static loopOnEnded = true

  callPlayer = callPlayer
  playerID = PLAYER_ID_PREFIX + randomString()
  load (url, isReady) {
    if (isReady) {
      getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY).then(FB => FB.XFBML.parse())
      return
    }
    getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY).then(FB => {
      FB.init({
        appId: this.props.config.facebook.appId,
        xfbml: true,
        version: 'v2.5'
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
          if (!this.props.muted) {
            // Player is muted by default
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
  seekTo (seconds) {
    this.callPlayer('seek', seconds)
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
    const style = {
      width: '100%',
      height: '100%',
      backgroundColor: 'black'
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
      />
    )
  }
}

export default createSinglePlayer(Facebook)
