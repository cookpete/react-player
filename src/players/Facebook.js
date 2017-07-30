import React from 'react'
import loadScript from 'load-script'

import Base from './Base'

const SDK_URL = '//connect.facebook.net/en_US/sdk.js'
const SDK_GLOBAL = 'FB'
const SDK_GLOBAL_READY = 'fbAsyncInit'
const MATCH_URL = /^https:\/\/www\.facebook\.com\/([^/?].+\/)?video(s|\.php)[/?].*$/
const PLAYER_ID_PREFIX = 'facebook-player-'

export default class YouTube extends Base {
  static displayName = 'Facebook'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  playerID = PLAYER_ID_PREFIX + randomString()
  getSDK () {
    if (window[SDK_GLOBAL]) {
      return Promise.resolve(window[SDK_GLOBAL])
    }
    return new Promise((resolve, reject) => {
      const previousOnReady = window[SDK_GLOBAL_READY]
      window[SDK_GLOBAL_READY] = function () {
        if (previousOnReady) previousOnReady()
        resolve(window[SDK_GLOBAL])
      }
      loadScript(SDK_URL, err => {
        if (err) reject(err)
      })
    })
  }
  load (url) {
    if (this.isReady) {
      this.getSDK().then(FB => FB.XFBML.parse())
      return
    }
    this.getSDK().then(FB => {
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
    if (!this.isReady) return
    this.player.play()
  }
  pause () {
    if (!this.isReady) return
    this.player.pause()
  }
  stop () {
    // No need to stop
  }
  seekTo (amount) {
    const seconds = super.seekTo(amount)
    if (!this.isReady) return
    this.player.seek(seconds)
  }
  setVolume (fraction) {
    if (!this.isReady) return
    if (fraction !== 0) {
      this.player.unmute()
    }
    this.player.setVolume(fraction)
  }
  setPlaybackRate () {
    return null
  }
  getDuration () {
    if (!this.isReady) return null
    return this.player.getDuration()
  }
  getFractionPlayed () {
    if (!this.isReady || !this.getDuration()) return null
    return this.player.getCurrentPosition() / this.getDuration()
  }
  getFractionLoaded () {
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

// http://stackoverflow.com/a/38622545
function randomString () {
  return Math.random().toString(36).substr(2, 5)
}
