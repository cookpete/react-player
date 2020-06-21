import React, { Component } from 'react'

import { callPlayer } from '../utils'
import { canPlay, MATCH_URL_CLOUDFLARESTREAM } from '../patterns'

export default class CloudflareStream extends Component {
  static displayName = 'CloudFlare'
  static canPlay = canPlay.cloudflare
  callPlayer = callPlayer

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  componentDidUpdate () {
    if (this.props.playing) {
      this.play()
    } else {
      this.pause()
    }
  }

  componentWillUnmount () {
    document.body.removeChild(this.script)
  }

  load (url) {
    console.log('Cloudflarestream player loaded')

    if (MATCH_URL_CLOUDFLARESTREAM.test(url)) {
      this.props.onReady()

      const src = url.substring(url.lastIndexOf('/') + 1)
      this.script = document.createElement('script')
      this.script.src = `https://embed.cloudflarestream.com/embed/r4xu.fla9.latest.js?video=${src}`
      this.script['data-cfasync'] = 'false'
      this.script.defer = true
      this.script.type = 'text/javascript'
      document.body.appendChild(this.script)

      this.player = document.getElementById('cloudflareStreamPlayer')
    } else {
      this.props.onError('Cloudflare player needs to take a Cloudflare Stream URL')
    }
  }

  refreshDuration () {
    this.player.getDuration().then(duration => {
      this.duration = duration
    })
  }

  play () {
    this.callPlayer('play')
  }

  pause () {
    this.callPlayer('pause')
  }

  stop () {
    this.callPlayer('unload')
  }

  seekTo (seconds) {
    if (this.player) {
      this.player.currentTime = seconds
    }
  }

  setVolume (fraction) {
    if (this.player) {
      this.player.volume = fraction
    }
  }

  setLoop (loop) {
    if (this.player) {
      this.player.loop = loop
    }
  }

  setPlaybackRate (rate) {
    this.callPlayer('setPlaybackRate', rate)
  }

  mute = () => {
    this.player.muted = true
  }

  unmute = () => {
    if (this.props.volume !== null) {
      this.setVolume(this.props.volume)
      this.player.muted = false
    }
  }

  getDuration () {
    return this.player && this.player.duration
  }

  getCurrentTime () {
    return this.player && this.player.currentTime
  }

  getSecondsLoaded () {
    console.log('getSecondsLoaded returns current time because Cloudflare does not have a loaded property')
    return this.player && this.player.currentTime
  }

  ref = container => {
    this.container = container
  }

  render () {
    const { display, url, muted } = this.props

    const src = url.substring(url.lastIndexOf('/') + 1)
    const style = {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      display
    }
    return (
      <div
        key='cloudflareStream'
        ref={this.ref}
        style={style}
      >
        <stream autoplay id='cloudflareStreamPlayer' preload='auto' src={src} controls={this.props.controls} muted={muted} />
      </div>
    )
  }
}
