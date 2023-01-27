import React, { Component } from 'react'

import { callPlayer, getSDK, queryString } from '../utils'
import { canPlay, MATCH_URL_MIXCLOUD } from '../patterns'

const SDK_URL = 'https://widget.mixcloud.com/media/js/widgetApi.js'
const SDK_GLOBAL = 'Mixcloud'

export default class Mixcloud extends Component {
  static displayName = 'Mixcloud'
  static canPlay = canPlay.mixcloud
  static loopOnEnded = true
  callPlayer = callPlayer
  duration = null
  currentTime = null
  secondsLoaded = null

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  load (url) {
    getSDK(SDK_URL, SDK_GLOBAL).then(Mixcloud => {
      this.player = Mixcloud.PlayerWidget(this.iframe)
      this.player.ready.then(() => {
        this.player.events.play.on(this.props.onPlay)
        this.player.events.pause.on(this.props.onPause)
        this.player.events.ended.on(this.props.onEnded)
        this.player.events.error.on(this.props.error)
        this.player.events.progress.on((seconds, duration) => {
          this.currentTime = seconds
          this.duration = duration
        })
        this.props.onReady()
      })
    }, this.props.onError)
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

  seekTo (seconds) {
    this.callPlayer('seek', seconds)
  }

  setVolume (fraction) {
    // No volume support
  }

  mute = () => {
    // No volume support
  }

  unmute = () => {
    // No volume support
  }

  getDuration () {
    return this.duration
  }

  getCurrentTime () {
    return this.currentTime
  }

  getSecondsLoaded () {
    return null
  }

  ref = iframe => {
    this.iframe = iframe
  }

  render () {
    const { url, config } = this.props
    const id = url.match(MATCH_URL_MIXCLOUD)[1]
    const style = {
      width: '100%',
      height: '100%'
    }
    const query = queryString({
      ...config.options,
      feed: `/${id}/`
    })
    // We have to give the iframe a key here to prevent a
    // weird dialog appearing when loading a new track
    return (
      <iframe
        key={id}
        ref={this.ref}
        style={style}
        src={`https://www.mixcloud.com/widget/iframe/?${query}`}
        frameBorder='0'
        allow='autoplay'
      />
    )
  }
}
