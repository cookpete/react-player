// TODO: ReactPlayer's listener logic is very shaky because if you change the function identity
//       it won't get cleaned up. This is an existing problem so we're not gonna fix it here.
import React, { Component } from 'react'

import { getSDK } from '../utils'
import createSinglePlayer from '../singlePlayer'

const PHENIX_SDK_URL = 'https://unpkg.com/phenix-web-sdk@2019.2.3/dist/phenix-web-sdk.min.js'
const PHENIX_SDK_GLOBAL = 'phenix-web-sdk'

// TODO: Add optional auth data parameter at the end
const PHENIX_URL_REGEX = /^phenix:(.+?)\|(.+?)(?:\|(.+?))?$/i // i hate this so much

function getPhenixSdk () {
  return getSDK(PHENIX_SDK_URL, PHENIX_SDK_GLOBAL)
}

function canPlay (url) {
  return PHENIX_URL_REGEX.test(url)
}

export class PhenixPlayer extends Component {
  static displayName = 'PhenixPlayer'
  static canPlay = canPlay
  player = null
  channelExpress = null

  playerRef = (player) => {
    if (player === this.player) {
      return
    }
    if (this.player) {
      this.removeListeners()
    }
    this.player = player
    if (this.player) {
      this.addListeners()
    }
  }

  componentWillUnmount () {
    // TODO: If refs get called with null on unmount, no reason to do this
    if (this.player) {
      this.removeListeners()
      this.player = null
    }
    if (this.channelExpress) {
      this.channelExpress.dispose()
      this.channelExpress = null
    }
  }

  addListeners () {
    const { onReady, onPlay, onPause, onEnded, onVolumeChange, onError, playsinline, videoElementId } = this.props
    this.player.addEventListener('canplay', onReady)
    this.player.addEventListener('play', onPlay)
    this.player.addEventListener('pause', onPause)
    this.player.addEventListener('seeked', this.onSeek)
    this.player.addEventListener('ended', onEnded)
    this.player.addEventListener('error', onError)
    this.player.addEventListener('volumechange', onVolumeChange)
    // wow
    this.player.setAttribute('id', videoElementId)
    if (playsinline) {
      this.player.setAttribute('playsinline', '')
      this.player.setAttribute('webkit-playsinline', '')
    }
  }
  removeListeners () {
    const { onReady, onPlay, onPause, onEnded, onVolumeChange, onError } = this.props
    this.player.removeEventListener('canplay', onReady)
    this.player.removeEventListener('play', onPlay)
    this.player.removeEventListener('pause', onPause)
    this.player.removeEventListener('seeked', this.onSeek)
    this.player.removeEventListener('ended', onEnded)
    this.player.removeEventListener('error', onError)
    this.player.removeEventListener('volumechange', onVolumeChange)
  }

  onSeek = e => {
    this.props.onSeek(e.target.currentTime)
  }

  getPhenixBackendUri (url = this.props.url) {
    return PHENIX_URL_REGEX.exec(url)[1]
  }

  getPhenixChannelId (url = this.props.url) {
    return PHENIX_URL_REGEX.exec(url)[2]
  }

  getPhenixAuthenticationData (url = this.props.url) {
    const match = PHENIX_URL_REGEX.exec(url)[3]
    return match ? JSON.parse(match) : {}
  }

  load (url) {
    const backendUri = this.getPhenixBackendUri(url)
    const channelId = this.getPhenixChannelId(url)
    const authenticationData = this.getPhenixAuthenticationData(url)

    const joinChannelCallback = (err, response) => {
      const success = !err && response.status === 'ok'
      if (!success) {
        const error = err || new Error(`Response status: ${response.status}`)
        this.props.onError(error)
      }
    }

    const subscriberCallback = (err, response) => {
      const success = !err && ['ok', 'no-stream-playing'].includes(response.status)
      if (!success) {
        const error = err || new Error(`Response status: ${response.status}`)
        this.props.onError(error)
      }
      // otherwise, response.mediaStream.getStreamId() will be a thing
    }

    getPhenixSdk().then((phenix) => {
      // TODO: Does this check do anything?
      if (url !== this.props.url) {
        return
      }
      if (this.channelExpress) {
        this.channelExpress.dispose()
        this.channelExpress = null
      }
      this.channelExpress = new phenix.express.ChannelExpress({
        authenticationData,
        backendUri
      })
      this.channelExpress.joinChannel(
        {
          channelId,
          videoElement: this.player
        },
        joinChannelCallback,
        subscriberCallback
      )
    })
  }

  play () {
    const promise = this.player.play()
    if (promise) {
      promise.catch(this.props.onError)
    }
  }
  pause () {
    this.player.pause()
  }
  stop () {
    if (this.channelExpress) {
      this.channelExpress.dispose()
      this.channelExpress = null
    }
  }
  seekTo (seconds) {
    if (seconds === Infinity || this.getDuration() === Infinity) {
      return
    }
    this.player.currentTime = seconds
  }
  setVolume (fraction) {
    this.player.volume = fraction
  }
  mute = () => {
    this.player.muted = true
  }
  unmute = () => {
    this.player.muted = false
  }
  setPlaybackRate (rate) {
    this.player.playbackRate = rate
  }
  getDuration () {
    return this.player.duration
  }
  getCurrentTime () {
    return this.player.currentTime
  }
  getSecondsLoaded () {
    const { buffered } = this.player
    if (buffered.length === 0) {
      return 0
    }
    const end = buffered.end(buffered.length - 1)
    const duration = this.getDuration()
    if (end > duration) {
      return duration
    }
    return end
  }

  render () {
    const { playing, loop, controls, muted, width, height } = this.props
    const style = {
      width: width === 'auto' ? width : '100%',
      height: height === 'auto' ? height : '100%'
    }
    return (
      <video
        ref={this.playerRef}
        style={style}
        preload='auto' // TODO
        autoPlay={playing} // TODO
        controls={controls} // TODO
        muted={muted}
        loop={loop}
      />
    )
  }
}

export default createSinglePlayer(PhenixPlayer) // TODO: WTF does this even do?
