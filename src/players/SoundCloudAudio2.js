// SoundCloudAudio.js

/* eslint semi: [0] */
/* eslint max-len: 0 */

import React from 'react'
import loadScript from 'load-script'
// import fetch from 'node-fetch'; // already there as react dependecy
import fetchJSONP from 'fetch-jsonp'
// import SoundCloudAudio from 'soundcloud-audio'

import FilePlayer from './FilePlayer'

// const SDK_URL = '//connect.soundcloud.com/sdk-2.0.0.js'
// const SDK_URL = 'https://cdn.rawgit.com/voronianski/soundcloud-audio.js/master/dist/soundcloud-audio.min.js'
const SDK_GLOBAL = 'SC'
const RESOLVE_URL = '//api.soundcloud.com/resolve.json'
const MATCH_URL =
  /^https?:\/\/(soundcloud.com|snd.sc)\/([a-z0-9-_]+\/[a-z0-9-_]+)$/

const songData = {} // Cache song data requests

export default class SoundCloud extends FilePlayer {
  // constructor() {
  //   super();
  // }
  static displayName = 'SoundCloud';
  static canPlay(url) {
    return MATCH_URL.test(url)
  }
  // state = {
  //   image: null
  // };
  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     super.shouldComponentUpdate(nextProps, nextState) ||
  //     this.state.image !== nextState.image
  //   )
  // }
/*  componentDidMount() {
    super.componentDidMount()
    this.player = this.refs.player
    console.log(this.player)
    console.log(this)
    console.log(super.componentDidMount)
  }*/
  componentDidMount () {
    super.componentDidMount()
  }
  // getSDK() {
  //   if (window[SDK_GLOBAL]) {
  //     return Promise.resolve(window[SDK_GLOBAL])
  //   }
  //   return new Promise((resolve, reject) => {
  //     if (!SoundCloudAudio) {
  //       reject('not found')
  //     } else {
  //       window[SDK_GLOBAL] = new SoundCloudAudio(this
  //         .props.soundcloudConfig.clientId)
  //       resolve(window[SDK_GLOBAL])
  //     }
  //   })
  // }
  getSongData(url) {
     if (songData[url]) {
      return Promise.resolve(songData[url])
    }
    return fetchJSONP(RESOLVE_URL + '?url=' + url + '&client_id=' + this.props.soundcloudConfig.clientId)
      .then(response => {
        if (response.ok) {
          songData[url] = response.json()
          return songData[url]
        } else {
          this.props.onError(new Error('SoundCloud track could not be resolved'))
        }
      })

   /* if (songData[url]) {
      return Promise.resolve(songData[url])
    }

    return new Promise((resolveP, reject) => {
      this.getSDK().then((SC) => {
        SC.resolve(url, (trackdata) => {
          if (trackdata) {
            resolveP(trackdata)
          } else {
            reject('not found')
          }
        })
      })
    }).then((val) => {
        songData[url] = val
        return songData[url]
      })
      .catch((err) => console.log(err))*/
  }
  // onStateChange = (state) => {
  //   console.log('statechange called with state:', state)
  //   if (state === 'playing') this.onPlay()
  //   if (state === 'paused') this.props.onPause()
  //   if (state === 'loading') this.props.onBuffer()
  //   if (state === 'ended') this.props.onEnded()
  // }

  // resolve(resolveURL, callback) {
  //   const callbackID = `jsonp_callback_${Date.now()}`
  //   window[callbackID] = (data) => {
  //     /* copy, paste from `SoundCloud.prototype._jsonp` */
  //       if (script.parentNode) {
  //           script.parentNode.removeChild(script);
  //       }
  //       window[callbackID] = function () {};
  //       console.log(data);
  //       callback(data);
  //   }

  //   loadScript(resolveURL, (err, script) => {
  //     if(err) { return console.log(err) }

  //     script.src = resolveURL;
  //     callback()
  //     // script.onload = (e) => {
  //     //   this.player.src = `${data.stream_url}?client_id=${clientId}`
  //     // }
  //   })
  // }

  load(url) {
    const { clientId } = this.props.soundcloudConfig
    this.stop()
    this.getSongData(url).then((data) => {
       if (data.streamable) {
        const src = `${data.stream_url}?client_id=${clientId}`
        this.player = this.refs.player
        this.player.src = src
      } else {
        console.log('error:', 'soundlcoud src is not streamable')
      }
    }, this.props.onError)
   /* this.getSDK().then((SC) => {
      this.getSongData(url).then((data) => {
        if (url !== this.props.url) {
          return // Abort if url changes during async requests
        }
        if (!data.streamable) {
          this.props.onError(new Error('SoundCloud track is not streamable'))
          return
        }
        const image = data.artwork_url || data.user.avatar_url
        if (image) {
          this.setState({ image: image.replace('-large', '-t500x500') })
        }
        const { clientId } = this.props.soundcloudConfig


        // this.player = SC;
        // this.player = super.ref.player;
        // this.player = this.props.ref.player;
        console.log(data.stream_url)
        this.player.src = `${data.stream_url}?client_id=${clientId}`
        // SC.preload(data.stream_url);
        // SC.on('loadstart', () => {
        //   this.onStateChange('loading');
        // })
        // SC.on('play', () => {
        //   this.onStateChange('playing');
        // })
        // SC.on('pause', () => {
        //   this.onStateChange('paused');
        // })
        // SC.on('ended', () => {
        //   this.onStateChange(data.type);
        // })
        this.onReady()
      }, this.props.onError)
    }, this.props.onError)
*/

    // const callback = (resolvedData) => {
    //   console.log(resolvedData);
    //   if (resolvedData.streamable) {
    //     const src = `${data.stream_url}?callback=${callbackID}`
    //     this.player.src = src
    //   } else {
    //     console.log('error:', 'soundlcoud src is not streamable')
    //   }
    // }


    // const scAPI = 'https://api.soundcloud.com'

/*
    // Date.now() may need polyfill ?
    const callbackID = `jsonp_callback_${Date.now()}`

    window[callbackID] = (data) => {

    }*/

    // const resolveUrl =
    //   `${scAPI}/resolve.json?url=${encodeURIComponent(url)}&client_id=${clientId}`

    // const jsonpUrl = `${data.stream_url}?callback=${callbackID}`

    // this.resolve(resolveUrl, callback)

    // this.getSongData(url)

  }

  // getFractionLoaded () {
  //   if (!this.isReady) return null
  //   return this.player.audio.seekable.length
  // }
  // getFractionPlayed() {
  //   if (!this.isReady) return null
  //     console.log( (this.player.audio.currentTime) / this.player.duration)
  //   return (this.player.audio.currentTime) / this.player.duration
  // }
  // getDuration(ms) {
  //   if (!this.isReady) return null
  //   if (ms) return this.player.duration * 1000
  //   return this.player.duration
  // }
/*
  play() {
    if (!this.isReady) return
    this.player.play()
  }
  pause() {
    if (!this.isReady) return
    this.player.pause()
  }
  stop() {
    if (!this.isReady) return
    this.player.unbindAll();
    this.player.stop()
  }
  seekTo(fraction) {
    super.seekTo(fraction)
    if (!this.isReady) return
    return this.player.audio.currentTime = this.player.duration * fraction;
  }
  setVolume(fraction) {
    if (!this.isReady) return
    this.player.audio.volume = fraction
  }


  getFractionLoaded() {
    if (!this.isReady) return null
    return this.player.audio.seekable.length
  }
  render() {
    const style = {
      display: this.props.url ? 'block' : 'none',
      height: '100%',
      backgroundImage: this.state.image ? `url(${this.state.image})` : null,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
    return <div style={ style } />
  }
  */
 /* render () {
    // get audio as default
    // const Media = !(VIDEO_EXTENSIONS.test(this.props.url)) ? 'audio' : 'video';
    const style = { display: this.props.url ? 'block' : 'none' }
    return (
      <audio
        className='filePlayer'
        ref='player'
        style={style}
        width='100%'
        height='100%'
        preload='auto'
      />
    )
  }*/

  // render() {
  //   return false;
  // }
}
