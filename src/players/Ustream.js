import React, { Component } from 'react'

import { callPlayer, getSDK, randomString, queryString } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = 'http://developers.ustream.tv/js/ustream-embedapi.min.js'
const SDK_GLOBAL = 'UstreamEmbed'
const MATCH_URL = /(ustream.tv\/channel\/)([^\#\&\?\/]*)/
const PLAYER_ID_PREFIX = 'ustream-player-'
export class Ustream extends Component {
  static displayName = 'UstreamLive';
  static canPlay = url => MATCH_URL.test(url);
  static loopOnEnded = false;


  playerID = PLAYER_ID_PREFIX + randomString()

  callPlayer = callPlayer
  parseId (url) {
    const m = url.match(MATCH_URL)
    return m[2]
  }
  load (url) {
    console.log('loadUrl')
    getSDK(SDK_URL, SDK_GLOBAL).then(UstreamEmbed => {
      this.player = UstreamEmbed(this.playerID)
      this.player.addListener('playing', (type, playing) => {
        if (playing) {
          this.props.onPlay()
        } else {
          this.props.onPause()
        }
      })
      this.player.addListener('live', () => {
        this.props.onReady()
      })
      this.player.addListener('offline', () => {
        this.props.onReady()
      })
      this.player.addListener('finished', this.props.onEnded)
      this.player.getProperty('duration', (duration) => {
        this.player.duration = duration;
        this.props.onDuration(duration)
      });
      setInterval( () => {
        this.player.getProperty('progress', (progress) => {
          this.currentTime = progress
          console.log('asdsadasdas');
          this.props.onProgress(progress)
        });
      }, 1000)

    }, this.props.onError)
  }
  play () {
    console.log('do a play');
    this.callPlayer('callMethod', 'play')
  }
  pause () {
    console.log('do a pause');
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
    return this.player.duration || null
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
    const channelId = this.parseId(this.props.url)
    const base = '//www.ustream.tv/embed'
    const style = {
      width: '100%',
      height: '100%'
    }
    const query = queryString({
      autoplay: this.props.playing,
    })

    return (
      <iframe
        id={this.playerID}
        ref={this.ref}
        src={`${base}/${channelId}?html5ui?${query}`}
        frameBorder='0'
        scrolling='no'
        style={style}
        allowFullScreen
      />
    )
  }
}

export default createSinglePlayer(Ustream)
