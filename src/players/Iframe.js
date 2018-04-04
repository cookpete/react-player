import React, { Component } from 'react'

import { callPlayer, getSDK, randomString, queryString } from '../utils'
import createSinglePlayer from '../singlePlayer'

const SDK_URL = 'http://developers.ustream.tv/js/ustream-embedapi.min.js'
const SDK_GLOBAL = 'UstreamEmbed'
const MATCH_URL = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
const PLAYER_ID_PREFIX = 'Iframe-player-'
export class Iframe extends Component {
  static displayName = 'Iframe';
  static canPlay = url => MATCH_URL.test(url);
  playerID = PLAYER_ID_PREFIX + randomString()

  load (url) {
    this.player = {
      currentTime: 0
    }
    this.props.onReady()
  }
  play () {
    this.playTime = Date.now()
    this.props.onPlay()
  }
  pause () {
    this.player.currentTime = this.getCurrentTime()
    this.playTime = null
    this.props.onPause()
  }
  stop () {
    this.player.currentTime = this.getCurrentTime()
    this.playTime = null
    this.props.onPause()
  }
  seekTo (seconds) {
    // no support
  }
  setVolume (fraction) {
    // no support
  }
  getDuration () {
    return Infinity
  }
  getCurrentTime () {
    let playing = 0
    if (this.playTime) {
      playing = (Date.now() - this.playTime) / 1000
    }
    return this.player.currentTime + playing
  }
  getSecondsLoaded () {
    return null
  }
  ref = container => {
    this.container = container
  }
  render () {
    const base = '//www.ustream.tv/embed'
    const style = {
      width: '100%',
      height: '100%'
    }
    const {url, playing} = this.props
    if (playing) {
      return (
        <iframe
          id={this.playerID}
          ref={this.ref}
          src={playing && url}
          frameBorder='0'
          scrolling='no'
          style={style}
          allowFullScreen
        />
      )
    } else {

      // pause flow for iframe
      return (
        <div style={style} >
          <div style={{
            alignItems: 'center',
            background: 'rgba(255,255,255,0.3)',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            width: '100%',
          }}>
            <div className="pause" style= {{
              borderStyle: 'double',
              borderWidth: '0px 0px 0px 50px',
              color: 'gray',
              height: '60px',
            }}/>
          </div>
        </div>
      )
    }
  }
}

export default createSinglePlayer(Iframe)
