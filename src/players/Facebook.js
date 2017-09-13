import React from 'react'

import Base from './Base'
import { getSDK, randomString } from '../utils'

const SDK_URL = '//connect.facebook.net/en_US/sdk.js'
const SDK_GLOBAL = 'FB'
const SDK_GLOBAL_READY = 'fbAsyncInit'
const MATCH_URL = /^https:\/\/www\.facebook\.com\/([^/?].+\/)?video(s|\.php)[/?].*$/
const PLAYER_ID_PREFIX = 'facebook-player-'

export default class Facebook extends Base {
  static displayName = 'Facebook'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  playerID = PLAYER_ID_PREFIX + randomString()
  load (url) {
    if (this.isReady) {
      getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY).then(FB => FB.XFBML.parse())
      return
    }
    getSDK(SDK_URL, SDK_GLOBAL, SDK_GLOBAL_READY).then(FB => {
      FB.init({
        appId: this.props.config.facebook.appId,
        xfbml: true,
        version: 'v2.5'
      })
      FB.Event.subscribe('xfbml.ready', msg => {
        if (msg.type === 'video' && msg.id === this.playerID) {
          this.player = msg.instance
          this.player.subscribe('startedPlaying', this.onPlay)
          this.player.subscribe('paused', this.props.onPause)
          this.player.subscribe('finishedPlaying', this.onEnded)
          this.player.subscribe('startedBuffering', this.props.onBuffer)
          this.player.subscribe('error', this.props.onError)
          this.onReady()
        }
      })
    })
  }
  onEnded = () => {
    const { loop, onEnded } = this.props
    if (loop) {
      this.seekTo(0)
    }
    onEnded()
  }
  play () {
    this.callPlayer('play')
  }
  pause () {
    this.callPlayer('pause')
  }
  stop () {
    // No need to stop
  }
  seekTo (amount) {
    const seconds = super.seekTo(amount)
    this.player.seek(seconds)
  }
  setVolume (fraction) {
    if (fraction !== 0) {
      this.callPlayer('unmute')
    }
    this.player.setVolume(fraction)
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
        data-allowfullscreen='true'
        data-controls={!this.props.controls ? 'false' : undefined}
      />
    )
  }
}
