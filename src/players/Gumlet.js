import React, { Component } from 'react'

import { callPlayer, getSDK } from '../utils'
import { canPlay } from '../patterns'

const SDK_URL = 'https://cdn.jsdelivr.net/npm/@gumlet/player.js@2.0/dist/player.min.js'
const SDK_GLOBAL = 'playerjs'

export default class Gumlet extends Component {
  static displayName = 'Gumlet'
  static canPlay = canPlay.gumlet
  callPlayer = callPlayer
  duration = null
  currentTime = null
  secondsLoaded = null

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  load (url) {
    getSDK(SDK_URL, SDK_GLOBAL).then(playerjs => {
      if (!this.iframe) return
      this.player = new playerjs.Player(this.iframe)
      this.player.on('ready', () => {
        // An arbitrary timeout is required otherwise
        // the event listeners won’t work
        setTimeout(() => {
          this.player.isReady = true
          this.player.setLoop(this.props.loop)
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
    player.on('play', props.onPlay)
    player.on('pause', props.onPause)
    player.on('progress', (e) => {
      if (this.props.onProgress) this.props.onProgress(e)
    })
    player.on('timeupdate', (e) => {
      if (this.props.onTimeUpdate) this.props.onTimeUpdate(e)
    })
    player.on('ended', props.onEnded)
    player.on('onFullScreenChange', (e) => {
        props.onFullScreenChange(e)
    })
    player.on('onPipChange', (e) => {
        props.onPipChange(e)
    })
    player.on('onAudioChange', (e) => {
        props.onAudioChange(e)
    });
    player.on('onQualityChange', (e) => {
        props.onQualityChange(e)
    })
    player.on('onVolumeChange', (e) => {
        props.onVolumeChange(e)
    })
    player.on('seeked', (e) => {
        props.onSeeked(e)
    })
    player.on('error', (e) => {
      props.onError(e);
    })
    player.on('mute', props.onMute)
  }

  play () {
    this.callPlayer('play')
  }

  pause () {
    this.callPlayer('pause')
  }

  mute = () => {
    this.callPlayer('mute')
  }

  unmute = () => {
    this.callPlayer('unmute')
  }

  setVolume (fraction) {
    this.callPlayer('setVolume', fraction)
  }

  seekTo (seconds, keepPlaying = true) {
    this.callPlayer('setCurrentTime', seconds)
    if (!keepPlaying) {
      this.pause()
    }
  }
  
  setPlaybackRate (rate) {
    this.callPlayer('setPlaybackRate', rate)
  }

  stop () {
    // Nothing to do
  }

  setLoop (loop) {
    // Nothing to do
  }

  getPaused () {
    return new Promise((resolve, reject) => {
      this.player.getPaused((e)=>{
        resolve(e);
      });
    });
  }

  getMuted = () => {
    return new Promise((resolve, reject) => {
      this.player.getMuted((e)=>{
        resolve(e);
      });
    });
  };

  getVolume = () => {
    return new Promise((resolve, reject) => {
        this.player.getVolume((e)=>{
        resolve(e);
      });
    });
  };

  getDuration () {
    return new Promise((resolve, reject) => {
      this.player.getDuration((e)=>{
        resolve(e);
      });
    });
  }

  getCurrentTime () {
    return new Promise((resolve, reject) => {
      this.player.getCurrentTime((e)=>{
        resolve(e);
      });
    });
  }

  getSecondsLoaded () {
    // Gumlet doesn't provide a way to get the seconds loaded
  }

  getPlaybackRate = () => {
    return new Promise((resolve, reject) => {
      this.player.getPlaybackRate((e)=>{
        resolve(e);
      });
    });
  };

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
        loading="lazy" 
        src={this.props.url}
        style={style}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"
        allowFullScreen
      />
    )
  }
}
