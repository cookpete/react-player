import React from 'react'
import loadScript from 'load-script'

import Base from './Base'

const SDK_URL = '//connect.soundcloud.com/sdk-2.0.0.js'
const SDK_GLOBAL = 'SC'
const RESOLVE_URL = '//api.soundcloud.com/resolve.json'
const MATCH_URL = /^https?:\/\/(soundcloud.com|snd.sc)\/([a-z0-9-_]+\/[a-z0-9-_]+)$/

export default class SoundCloud extends Base {
  static displayName = 'SoundCloud';
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  state = {
    image: null
  };
  shouldComponentUpdate (nextProps, nextState) {
    return (
      super.shouldComponentUpdate(nextProps, nextState) ||
      this.state.image !== nextState.image
    )
  }
  getSDK () {
    if (window[SDK_GLOBAL]) {
      return Promise.resolve(window[SDK_GLOBAL])
    }
    return new Promise((resolve, reject) => {
      loadScript(SDK_URL, err => {
        if (err) {
          reject(err)
        } else {
          window[SDK_GLOBAL].initialize({ client_id: this.props.soundcloudConfig.clientId })
          resolve(window[SDK_GLOBAL])
        }
      })
    })
  }
  getSongData (url) {
    return fetch(RESOLVE_URL + '?url=' + url + '&client_id=' + this.props.soundcloudConfig.clientId)
      .then(response => response.json())
  }
  load (url) {
    this.stop()
    this.getSDK().then(SC => {
      this.getSongData(url).then(data => {
        if (url !== this.props.url) return // Abort if url changes during async requests
        const image = data.artwork_url || data.user.avatar_url
        if (image) {
          this.setState({ image: image.replace('-large', '-t500x500') })
        }
        SC.stream(data.uri, player => {
          this.player = player
          player._player.on('stateChange', this.onStateChange)
          this.onReady()
        })
      })
    })
  }
  onStateChange = state => {
    if (state === 'playing') this.onPlay()
    if (state === 'paused') this.props.onPause()
    if (state === 'loading') this.props.onBuffer()
    if (state === 'ended') this.props.onEnded()
  };
  play () {
    if (!this.isReady) return
    this.player.play()
  }
  pause () {
    if (!this.isReady) return
    this.player.pause()
  }
  stop () {
    if (!this.isReady) return
    this.player._player.off('stateChange', this.onStateChange)
    this.player.stop()
  }
  seekTo (fraction) {
    super.seekTo(fraction)
    if (!this.isReady) return
    this.player.seek(this.getDuration(true) * fraction)
  }
  setVolume (fraction) {
    if (!this.isReady) return
    this.player.setVolume(fraction)
  }
  getDuration (ms) {
    if (!this.isReady) return null
    if (ms) return this.player.getDuration()
    return this.player.getDuration() / 1000
  }
  getFractionPlayed () {
    if (!this.isReady) return null
    return this.player.getCurrentPosition() / this.getDuration(true)
  }
  getFractionLoaded () {
    if (!this.isReady) return null
    return this.player.getLoadedPosition() / this.getDuration(true)
  }
  render () {
    const style = {
      display: this.props.url ? 'block' : 'none',
      height: '100%',
      backgroundImage: this.state.image ? 'url(' + this.state.image + ')' : null,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
    return <div style={style} />
  }
}
