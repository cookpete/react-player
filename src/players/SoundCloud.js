// SoundCloudAudio.js

/* eslint semi: [0] */
/* eslint max-len: 0 */

// import React from 'react'
import fetchJSONP from 'fetch-jsonp'

import FilePlayer from './FilePlayer'

const RESOLVE_URL = '//api.soundcloud.com/resolve.json'
const MATCH_URL =
  /^https?:\/\/(soundcloud.com|snd.sc)\/([a-z0-9-_]+\/[a-z0-9-_]+)$/

const songData = {} // Cache song data requests

export default class SoundCloud extends FilePlayer {

  static displayName = 'SoundCloud';
  static canPlay (url) {
    return MATCH_URL.test(url)
  }

  getSongData (url) {
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
  }

  load (url) {
    const { clientId } = this.props.soundcloudConfig
    this.stop()
    this.getSongData(url)
      .then((data) => {
        if (data.streamable) {
          const src = `${data.stream_url}?client_id=${clientId}`
          this.player = this.refs.player
          this.player.src = src
        } else {
          console.log('error:', 'soundlcoud src is not streamable')
        }
      }, this.props.onError)
  }
}
