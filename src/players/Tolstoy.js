/* global globalThis */

import React, { Component } from 'react'
import { canPlay } from '../patterns'

const PLAYER_TYPE = 'react-player-embed'
const ORIGIN = 'https://player.gotolstoy.com'

export default class Tolstoy extends Component {
  static displayName = 'Tolstoy'
  static canPlay = canPlay.tolstoy
  duration = null
  currentTime = null
  secondsLoaded = null

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  componentWillUnmount () {
    globalThis.removeEventListener('message', this.handleMessage)
  }

  load (url) {
    if (!this.iframe) return
    globalThis.addEventListener('message', this.handleMessage)
    if (this.props.muted) {
      this.player.mute()
    }

    const addSneakPeek = url.includes('sneakpeek') ? '&sneakpeek' : ''

    this.url = `${url.split('?')[0]}?host&playerType=${PLAYER_TYPE}${addSneakPeek}`
    this.iframe.src = this.url
  }

  handleMessage = (event) => {
    if (event.origin !== ORIGIN) {
      return
    }

    const eventName = event.data.name

    if (typeof eventName !== 'string') {
      return
    }

    if (eventName === 'error') {
      this.props.onError(event.data.data)
    }
    if (eventName === 'tolstoyPlayerReady') {
      this.props.onReady()
    }

    if (eventName === 'tolstoyPlayerMetadataChange') {
      this.duration = event.data.duration
      this.currentTime = event.data.currentTime
    }

    if (eventName === 'videoResume' || eventName === 'feedPlay' || eventName === 'sessionStart' || eventName === 'tolstoyStarted') {
      this.props.onPlay()
    }

    if (eventName === 'videoPause' || eventName === 'feedPause') {
      this.props.onPause()
    }

    if (eventName === 'tolstoyReachedEnd') {
      this.props.onEnded()
    }
  }

  postMessage = (eventName, data) => {
    if (!this.iframe || !this.iframe.contentWindow) {
      return
    }

    this.iframe.contentWindow.postMessage({ eventName, ...data }, '*')
  }

  play () {
    this.postMessage('tolstoyPlayerPlayPause')
  }

  pause () {
    this.postMessage('tolstoyPlayerPlayPause')
  }

  setPlaybackRate (speed) {
    this.postMessage('tolstoyPlayerPlayBackRate', { speed })
  }

  stop () {
    // Nothing to do
  }

  seekTo (seconds) {
    this.postMessage('tolstoyPlayerSeek', { seconds })
  }

  setVolume (fraction) {
    this.postMessage('tolstoyVolumeChange', { volume: fraction })
  }

  setLoop (loop) {
    // Not supported
  }

  mute () {
    this.postMessage('tolstoyPlayerMutedChange')
  }

  unmute () {
    this.postMessage('tolstoyPlayerMutedChange')
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

  ref = iframe => {
    this.iframe = iframe
  }

  render () {
    const style = {
      width: '100%', height: '100%'
    }
    return (<iframe
      ref={this.ref}
      frameBorder="0"
      scrolling="no"
      style={style}
      title="Tolstoy-player"
      allow="autoplay *; clipboard-write *;camera *; microphone *; encrypted-media *; fullscreen *; display-capture *;"
    />)
  }
}
