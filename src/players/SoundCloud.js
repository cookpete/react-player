import React from 'react'

import Base from './Base'
import { getSDK } from '../utils'

const SDK_URL = 'https://w.soundcloud.com/player/api.js'
const SDK_GLOBAL = 'SC'
const MATCH_URL = /^https?:\/\/(soundcloud.com|snd.sc)\/([a-z0-9-_]+\/[a-z0-9-_]+)$/
const DEFAULT_OPTIONS = {
  visual: true, // Undocumented, but makes player fill container and look better
  buying: false,
  liking: false,
  download: false,
  sharing: false,
  show_comments: false,
  show_playcount: false
}

export default class SoundCloud extends Base {
  static displayName = 'SoundCloud'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  duration = null
  currentTime = null
  fractionLoaded = null
  load (url) {
    getSDK(SDK_URL, SDK_GLOBAL).then(SC => {
      const { PLAY, PLAY_PROGRESS, PAUSE, FINISH, ERROR } = SC.Widget.Events
      if (!this.isReady) {
        this.player = SC.Widget(this.iframe)
        this.player.bind(PLAY, () => {
          // Use widgetIsPlaying to prevent calling play() when widget
          // is playing, which causes bugs with the SC widget
          this.widgetIsPlaying = true
          this.onPlay()
        })
        this.player.bind(PAUSE, () => {
          this.widgetIsPlaying = false
          this.props.onPause()
        })
        this.player.bind(PLAY_PROGRESS, e => {
          this.currentTime = e.currentPosition / 1000
          this.fractionLoaded = e.loadedProgress
        })
        this.player.bind(FINISH, () => this.props.onEnded())
        this.player.bind(ERROR, e => this.props.onError(e))
      }
      this.player.load(url, {
        ...DEFAULT_OPTIONS,
        ...this.props.config.soundcloud.options,
        callback: () => {
          this.widgetIsPlaying = false
          this.player.getDuration(duration => {
            this.duration = duration / 1000
            this.onReady()
          })
        }
      })
    })
  }
  play () {
    if (!this.widgetIsPlaying) {
      this.callPlayer('play')
    }
  }
  pause () {
    if (this.widgetIsPlaying) {
      this.callPlayer('pause')
    }
  }
  stop () {
    this.pause()
    this.callPlayer('seekTo', 0)
  }
  seekTo (amount) {
    const seconds = super.seekTo(amount)
    this.callPlayer('seekTo', seconds * 1000)
  }
  setVolume (fraction) {
    this.callPlayer('setVolume', fraction * 100)
  }
  getDuration () {
    return this.duration
  }
  getCurrentTime () {
    return this.currentTime
  }
  getSecondsLoaded () {
    return this.fractionLoaded * this.duration
  }
  ref = iframe => {
    this.iframe = iframe
  }
  render () {
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
      <iframe
        ref={this.ref}
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(this.props.url)}`}
        style={style}
        frameBorder={0}
      />
    )
  }
}
