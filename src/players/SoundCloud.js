import React from 'react'
import loadScript from 'load-script'

import Base from './Base'

const SDK_URL = 'https://w.soundcloud.com/player/api.js'
const MATCH_URL = /^https?:\/\/(soundcloud.com|snd.sc)\/([a-z0-9-_]+\/[a-z0-9-_]+)$/

export default class SoundCloud extends Base {
  static displayName = 'SoundCloud'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  player = null
  duration = null
  fractionPlayed = null
  fractionLoaded = null
  getPlayer () {
    if (this.player) {
      return Promise.resolve(this.player)
    }
    return new Promise((resolve, reject) => {
      loadScript(SDK_URL, err => {
        if (err) return reject(err)
        this.player = window.SC.Widget(this.container)
        resolve(this.player)
      })
    })
  }
  ref = container => {
    this.container = container
  }
  componentWillUnmount () {
    this.getPlayer().then(player => {
      player.unbind(window.SC.Widget.Events.READY)
      player.unbind(window.SC.Widget.Events.PLAY)
      player.unbind(window.SC.Widget.Events.PLAY_PROGRESS)
      player.unbind(window.SC.Widget.Events.PAUSE)
      player.unbind(window.SC.Widget.Events.FINISH)
    })
  }
  load (url) {
    this.getPlayer().then(player => {
      player.load(url)
      player.bind(window.SC.Widget.Events.READY, () => {
        player.getDuration(duration => {
          this.duration = duration / 1000
          this.onReady()
        })
      })
      player.bind(window.SC.Widget.Events.PLAY, this.onPlay)
      player.bind(window.SC.Widget.Events.PLAY_PROGRESS, e => {
        this.fractionPlayed = e.relativePosition
        this.fractionLoaded = e.loadedProgress
      })
      player.bind(window.SC.Widget.Events.ERROR, e => this.props.onError(e))
      player.bind(window.SC.Widget.Events.PAUSE, () => this.props.onPause())
      player.bind(window.SC.Widget.Events.FINISH, () => this.props.onEnded())
    })
  }
  play () {
    this.getPlayer().then(player => {
      player.play()
    })
  }
  getSongData () {
    return new Promise(resolve => {
      this.getPlayer().then(player => {
        player.getCurrentSound(sound => resolve(sound))
      })
    })
  }
  pause () {
    this.getPlayer().then(player => {
      player.pause()
    })
  }
  stop () {
    this.getPlayer().then(player => {
      player.pause()
      player.seekTo(0)
    })
  }
  seekTo (fraction) {
    super.seekTo(fraction)
    this.getPlayer().then(player => {
      this.player.seekTo(this.getDuration() * fraction * 1000)
    })
  }
  setVolume (fraction) {
    this.getPlayer().then(player => {
      player.setVolume(fraction)
    })
  }
  setPlaybackRate () {
  }
  getDuration () {
    return this.duration
  }
  getFractionLoaded () {
    return this.fractionLoaded
  }
  getFractionPlayed () {
    return this.fractionPlayed
  }
  render () {
    const style = {
      width: '100%',
      height: '100%'
    }
    return (
      <div style={style}>
        <iframe
          src='https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/321006798'
          ref={this.ref}
          width='100%'
          height='100%'
        />
      </div>
    )
  }
}
