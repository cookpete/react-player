import React from 'react'
import loadScript from 'load-script'

import Base from './Base'

const CLIENT_ID = 'e8b6f84fbcad14c301ca1355cae1dea2'
const SDK_URL = '//connect.soundcloud.com/sdk-2.0.0.js'
const SDK_GLOBAL = 'SC'
const RESOLVE_URL = '//api.soundcloud.com/resolve.json'
const MATCH_URL = /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/

export default class SoundCloud extends Base {
  static propTypes = Base.propTypes // HACK: Prevent lint error
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  state = {
    image: null
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
          window[SDK_GLOBAL].initialize({ client_id: CLIENT_ID })
          resolve(window[SDK_GLOBAL])
        }
      })
    })
  }
  getSongData (url) {
    return fetch(RESOLVE_URL + '?url=' + url + '&client_id=' + CLIENT_ID)
      .then(response => response.json())
  }
  play (url) {
    if (!url && this.player) {
      this.player.play()
      return
    }
    this.getSDK().then(SC => {
      this.getSongData(url).then(data => {
        let image = data.artwork_url || data.user.avatar_url
        if (image) {
          this.setState({ image: image.replace('-large', '-t500x500') })
        }
        SC.stream(data.uri, this.options, player => {
          this.player = player
          player.play()
          player._player.on('stateChange', this.onStateChange)
        })
      })
    })
  }
  onStateChange = state => {
    if (state === 'playing') this.props.onPlay()
    if (state === 'paused') this.props.onPause()
    if (state === 'loading') this.props.onBuffer()
    if (state === 'ended') this.props.onEnded()
  }
  options = {
    onplay: this.props.onPlay,
    onpause: this.props.onPause,
    onbufferchange: function () {
      if (this.player.isBuffering) this.props.onBuffer()
    },
    onfinish: this.props.onFinish
  }
  pause () {
    if (!this.player) return
    this.player.pause()
  }
  stop () {
    if (!this.player) return
    this.player.stop()
  }
  seekTo (fraction) {
    if (!this.player) return
    this.player.seek(this.player.getDuration() * fraction)
  }
  setVolume (fraction) {
    if (!this.player) return
    this.player.setVolume(fraction)
  }
  getFractionPlayed () {
    if (!this.player) return 0
    return this.player.getCurrentPosition() / this.player.getDuration()
  }
  getFractionLoaded () {
    if (!this.player) return 0
    return this.player.getLoadedPosition() / this.player.getDuration()
  }
  render () {
    let style = {
      height: '100%',
      backgroundImage: this.state.image ? 'url(' + this.state.image + ')' : null,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
    return <div style={style} />
  }
}
