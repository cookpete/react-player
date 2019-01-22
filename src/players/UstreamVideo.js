import React, { Component } from 'react'

import { callPlayer, getSDK, randomString } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = 'http://developers.ustream.tv/js/ustream-embedapi.min.js'
const SDK_GLOBAL = 'UstreamEmbed'
const MATCH_URL = /(ustream.tv\/recorded\/)([^#&?/]*)/
const PLAYER_ID_PREFIX = 'UstreamVideo-player-'
export class UstreamVideo extends Component {
  static displayName = 'UstreamVideo';
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

  componentWillUnmount () {
    // clear the interval below
    if (this.currentTimeInterval) {
      clearInterval(this.currentTimeInterval)
    }
  }

  // there's no events to update progress and duration,
  // so we're going to set an interval here. Also, duration
  // is zero or null for the first few seconds. Couldn't find
  // a deterministic event to let us know when we should grab the duration.
  initInterval () {
    if (this.currentTimeInterval) {
      return
    }
    this.currentTimeInterval = setInterval(() => {
      if (this.player) {
        this.player.getProperty('progress', (progress) => {
          this.player.currentTime = progress
        })
        this.player.getProperty('duration', (duration) => {
          this.player.duration = duration
        })
      }
    }, 500)
  }

  load () {
    const {onEnded, onError, onPause, onPlay, onReady, playing, url} = this.props
    const videoId = this.parseId(url)
    this.setState({
      ustreamSrc: `https://www.ustream.tv/embed/recorded/${videoId}?html5ui=1&autoplay=${playing}&controls=false&showtitle=false`
    })
    getSDK(SDK_URL, SDK_GLOBAL).then(UstreamEmbed => {
      if (!this.container) return
      this.player = UstreamEmbed(this.playerID)
      this.player.addListener('playing', (type, playing) => {
        playing ? onPlay() : onPause()
      })
      this.player.addListener('ready', () => {
        this.initInterval()
        onReady()
      })
      this.player.addListener('finished', onEnded)
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
    return this.player.duration
  }
  getCurrentTime () {
    return this.player.currentTime
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

export default createSinglePlayer(UstreamVideo)
