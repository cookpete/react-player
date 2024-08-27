import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'
import { canPlay, MATCH_URL_VK } from '../patterns'

const SDK_URL = 'https://vk.com/js/api/videoplayer.js'
const SDK_GLOBAL = 'VK'

export default class VK extends Component {
  static displayName = 'VK'
  static canPlay = canPlay.vk
  callPlayer = callPlayer
  duration = null
  currentTime = null
  secondsLoaded = null

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  getOID (url) {
    return url.match(MATCH_URL_VK)[2]
  }

  getID (url) {
    return url.match(MATCH_URL_VK)[3]
  }

  load () {
    getSDK(SDK_URL, SDK_GLOBAL).then((playerjs) => {
      if (!this.iframe) return
      this.player = new playerjs.VideoPlayer(this.iframe)

      this.player.on('inited', () => {
        // An arbitrary timeout is required otherwise
        // the event listeners won’t work
        setTimeout(() => {
          this.player.isReady = true
          if (this.props.muted) {
            this.player.mute()
          }
          this.addListeners(this.player, this.props)
          this.props.onReady()
        }, 500)
      })
    }, this.props.onError)
  }

  addListeners (player, props) {
    player.on('started', props.onPlay)
    player.on('resumed', props.onPlay)
    player.on('paused', props.onPause)
    player.on('ended', props.onEnded)
    player.on('error', props.onError)
    player.on('timeupdate', ({ time, duration }) => {
      this.duration = duration
      this.currentTime = time
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

  seekTo (seconds, keepPlaying = true) {
    this.callPlayer('seek', seconds)
    if (!keepPlaying) {
      this.pause()
    }
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
    return this.duration
  }

  getCurrentTime () {
    return this.currentTime
  }

  getSecondsLoaded () {
    return this.secondsLoaded
  }

  ref = (iframe) => {
    this.iframe = iframe
  }

  render () {
    const style = {
      width: '100%',
      height: '100%',
      border: 'none'
    }

    return (
      <iframe
        ref={this.ref}
        src={`https://vk.com/video_ext.php?oid=${this.getOID(
          this.props.url
        )}&id=${this.getID(this.props.url)}&hd=2&js_api=1`}
        style={style}
        allow='autoplay; encrypted-media; fullscreen; picture-in-picture;'
        referrerPolicy='no-referrer-when-downgrade'
      />
    )
  }
}
