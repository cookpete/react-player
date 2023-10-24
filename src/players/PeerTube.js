import React, { Component } from 'react'
import { canPlay, MATCH_URL_PEERTUBE } from '../patterns'
import { callPlayer, getSDK, queryString } from '../utils'

const SDK_URL = 'https://unpkg.com/@peertube/embed-api/build/player.min.js'
const SDK_GLOBAL = 'PeerTubePlayer'

export class PeerTubePlayer extends Component {
  static displayName = 'PeerTubePlayer';
  static canPlay = canPlay.peertube;
  callPlayer = callPlayer;

  constructor (props) {
    super(props)
    this.currentTime = 0
    this.duration = 0
    this.playbackRate = 1
    this.getCurrentTime = this.getCurrentTime.bind(this)
    this.getEmbedUrl = this.getEmbedUrl.bind(this)
  }

  componentDidMount () {
    this.props.onMount && this.props.onMount(this)
  }

  getEmbedUrl = () => {
    const { config, url } = this.props
    const m = MATCH_URL_PEERTUBE.exec(url)

    const query = queryString({
      ...config.peertube,
      api: 1
    })

    return `${m[1]}://${m[2]}/videos/embed/${m[3]}?${query}`
  };

  load () {
    getSDK(SDK_URL, SDK_GLOBAL).then(() => {
      if (!this.iframe){
        console.log("no iframe")
        return
      } 
      const PeerTubePlayer = window.PeerTubePlayer
      this.player = new PeerTubePlayer(this.iframe)

      

      this.player.ready.then(() => {
        this.player.addEventListener('playbackStatusUpdate', (data) => {
          this.currentTime = data.position
          this.duration = data.duration
        })
        this.player.addEventListener('playbackStatusChange', (data) => {
          console.log('playbackStatusChange', data)
          if (data === 'playing') {
            this.props.onPlay()
          } else {
            this.props.onPause()
          }
        })

        this.props.onReady()
      })
    }, this.props.onError)

    // new Promise((resolve, reject) => {
    //   this.render();
    //   resolve();
    // })
    //   .then(() => {
    //     return getSDK(SDK_URL, "PeerTube");
    //   })
    //   .then(() => {
    //     this.player = new window["PeerTubePlayer"](this.container);

    //     this.setupEvents();

    //     return this.player.ready.then(() => {
    //       return this.props.onReady();
    //     });
    //   });
  }

  play () {
    this.callPlayer('play')
  }

  pause () {
    this.callPlayer('pause')
  }

  stop () {}

  seekTo (seconds) {
    this.callPlayer('seek', seconds)
  }

  setVolume (fraction) {
    this.callPlayer('setVolume', fraction)
  }

  setLoop (loop) {
    // console.log("SET LOOP");
  }

  mute () {
    // console.log("SET MUTE");
  }

  unmute () {
    // console.log("SET UNMUTE");
  }

  getDuration () {
    return this.duration
  }

  getCurrentTime () {
    return this.currentTime
  }

  getSecondsLoaded () {

  }

  getPlaybackRate () {
    if (this.player) {
      this.player.getPlaybackRate().then((rate) => {
        this.playbackRate = rate
      })
    }

    return this.playbackRate
  }

  setPlaybackRate (rate) {
    if (this.player) {
      this.player.setPlaybackRate(rate)
    }
  }

  ref = (iframe) => {
    this.iframe = iframe
  };

  render () {
    const style = {
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      border: 0,
      overflow: 'hidden'
    }
    const { url } = this.props

    return (
      <iframe
        key={url}
        ref={this.ref}
        style={style}
        src={this.getEmbedUrl(url)}
        frameBorder='0'
        scrolling='no'
        id='peerTubeContainer'
        allow='autoplay; fullscreen'
        sandbox='allow-same-origin allow-scripts allow-popups'
      />
    )
  }
}

export default PeerTubePlayer
