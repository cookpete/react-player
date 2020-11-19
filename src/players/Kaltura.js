import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'
import { canPlay } from '../patterns'

const SDK_URL = 'https://cdnapisec.kaltura.com/html5/html5lib/v2.83.2/kWidget/kWidget.js'
const SDK_GLOBAL = 'Kaltura'

export default class Kaltura extends Component {
  static displayName = 'Kaltura'
  static canPlay = canPlay.kaltura
  static loopOnEnded = true
  callPlayer = callPlayer
  duration = null
  currentTime = null
  secondsLoaded = null

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  load (url, isReady) {
    getSDK(SDK_URL, SDK_GLOBAL).then(kWidget => {
      if (!this.iframe) {
	return
      }
      this.props.onReady()
    })
  }

  play () {
    console.log('play() - to be implemented')
  }

  pause () {
    console.log('pause() - to be implemented')
  }

  stop () {
    // Nothing to do
  }

  seekTo (seconds) {
    console.log('seekTo() - to be implemented')
  }

  setVolume (fraction) {
    console.log('setVolume() - to be implemented')
  }

  mute = () => {
    console.log('mute() - to be implemented')
  }

  unmute = () => {
    console.log('unmute() - to be implemented')
  }

  getDuration () {
    console.log('getDuration() - to be implemented')
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
        src={this.props.url}
        style={style}
        frameBorder={0}
        width="100%"
        allow='encrypted-media'
	referrerPolicy='no-referrer-when-downgrade'
      />
    )
  }
}
