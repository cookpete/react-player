import React, { Component } from 'react'

import { callPlayer, getSDK, randomString } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = 'http://developers.ustream.tv/js/ustream-embedapi.min.js'
const SDK_GLOBAL = 'UstreamEmbed'
const MATCH_URL = /(ustream.tv\/channel\/)([^#&?/]*)/
const PLAYER_ID_PREFIX = 'UstreamLive-player-'
export class UstreamLive extends Component {
  static displayName = 'UstreamLive';
  static canPlay = url => MATCH_URL.test(url)
  static loopOnEnded = false;

  state = {
    ustreamSrc: null
  }

  playerID = PLAYER_ID_PREFIX + randomString()

  callPlayer = callPlayer
  parseId (url) {
    const m = url.match(MATCH_URL)
    return m[2]
  }
  componentDidUpdate (prevProps) {
    // reset ustreamSrc on reload
    if (prevProps.url && (prevProps.url !== this.props.url)) {
      this.setState({
        ustreamSrc: null
      })
    }
  }

  load () {
    const {onEnded, onError, onPause, onPlay, onReady, playing, url} = this.props
    const channelId = this.parseId(url)
    this.setState({
      ustreamSrc: `https://www.ustream.tv/embed/${channelId}?html5ui=1&autoplay=${playing}`
    })
    getSDK(SDK_URL, SDK_GLOBAL).then(UstreamEmbed => {
      if (!this.container) return
      this.currentTime = 0
      this.player = UstreamEmbed(this.playerID)
      this.player.addListener('playing', (type, playing) => {
        if (playing) {
          this.playTime = Date.now()
          onPlay()
        } else {
          this.currentTime = this.getCurrentTime()
          this.playTime = null
          onPause()
        }
      })
      this.player.addListener('live', onReady)
      this.player.addListener('offline', onReady)
      this.player.addListener('finished', onEnded)
      this.player.getProperty('duration', (duration) => {
        this.player.duration = duration || Infinity
      })
    }, onError)
  }
  // todo
  mute = () => {}
  // todo
  unmute = () => {}
  play () {
    this.callPlayer('callMethod', 'play')
  }
  pause () {
    this.callPlayer('callMethod', 'pause')
  }
  stop () {
    this.callPlayer('callMethod', 'stop')
  }
  seekTo (seconds) {
    this.callPlayer('callMethod', 'seek', seconds)
  }
  setVolume (fraction) {
    this.callPlayer('callMethod', 'volume', fraction * 100)
  }
  getDuration () {
    return Infinity
  }
  getCurrentTime () {
    let playing = 0
    if (this.playTime) {
      playing = (Date.now() - this.playTime) / 1000
    }
    return this.currentTime + playing
  }
  getSecondsLoaded () {
    return null
  }
  ref = container => {
    this.container = container
  }
  render () {
    const style = {
      width: '100%',
      height: '100%'
    }

    const {ustreamSrc} = this.state
    return (
      ustreamSrc && <iframe
        id={this.playerID}
        ref={this.ref}
        src={ustreamSrc}
        frameBorder='0'
        scrolling='no'
        style={style}
        allowFullScreen
      />
    )
  }
}

export default createSinglePlayer(UstreamLive)
