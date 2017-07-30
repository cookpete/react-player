import React from 'react'
import fetchJSONP from 'fetch-jsonp'

import FilePlayer from './FilePlayer'
import { defaultProps } from '../props'

const RESOLVE_URL = '//api.soundcloud.com/resolve.json'
const MATCH_URL = /^https?:\/\/(soundcloud.com|snd.sc)\/([a-z0-9-_]+\/[a-z0-9-_]+)$/

const songData = {} // Cache song data requests

export default class SoundCloud extends FilePlayer {
  static displayName = 'SoundCloud'
  static canPlay (url) {
    return MATCH_URL.test(url)
  }
  state = {
    image: null
  }
  shouldComponentUpdate (nextProps, nextState) {
    return (
      super.shouldComponentUpdate(nextProps, nextState) ||
      this.state.image !== nextState.image
    )
  }
  getSongData (url) {
    const { config } = this.props
    if (songData[url]) {
      return Promise.resolve(songData[url])
    }
    return fetchJSONP(RESOLVE_URL + '?url=' + url + '&client_id=' + config.soundcloud.clientId)
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
    const { config, onError } = this.props
    this.stop()
    this.getSongData(url).then(data => {
      if (!this.mounted) return
      if (!data.streamable) {
        onError(new Error('SoundCloud track is not streamable'))
        return
      }
      const image = data.artwork_url || data.user.avatar_url
      if (image && config.soundcloud.showArtwork) {
        this.setState({ image: image.replace('-large', '-t500x500') })
      }
      this.player.src = data.stream_url + '?client_id=' + config.soundcloud.clientId
    }, onError)
  }
  ref = player => {
    this.player = player
  }
  render () {
    const { url, loop, controls } = this.props
    const style = {
      display: url ? 'block' : 'none',
      height: '100%',
      backgroundImage: this.state.image ? 'url(' + this.state.image + ')' : null,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
    return (
      <div style={style}>
        <audio
          ref={this.ref}
          type='audio/mpeg'
          preload='auto'
          style={{
            width: '100%',
            height: '100%'
          }}
          controls={controls}
          loop={loop}
        />
      </div>
    )
  }
}
