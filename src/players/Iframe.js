import React, { Component } from 'react'

import { randomString } from '../utils'
import createSinglePlayer from '../singlePlayer'

const MATCH_URL = /^(https?:\/\/)?([\da-z\\.-]+)\.([a-z\\.]{2,6})([\\/\w \\.-]*)*\/?$/
const PLAYER_ID_PREFIX = 'Iframe-player-'
export class Iframe extends Component {
  static displayName = 'Iframe';
  static canPlay = url => MATCH_URL.test(url);
  playerID = PLAYER_ID_PREFIX + randomString()
  player = {
    currentTime: 0
  }
  load (url) {
    if (!this.container) {
      this.props.onReady()
    } else {
      setTimeout(() => this.props.onReady(), 3000)
    }
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
  mute = () => {
    // no support
  }
  unmute = () => {
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
            width: '100%'
          }}>
            <div className='pause' style={{
              borderStyle: 'double',
              borderWidth: '0px 0px 0px 50px',
              color: 'gray',
              height: '60px'
            }} />
          </div>
        </div>
      )
    }
  }
}

export default createSinglePlayer(Iframe)
